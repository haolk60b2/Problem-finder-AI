import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentType } from 'src/common/enums/document-type.enum';
import { SourceType } from 'src/common/enums/source-type.enum';
import { NormalizedDocument } from '../analysis/interfaces/normalized-document.interface';

type RedditSourceConfig = {
  subreddits?: string[];
  limit?: number;
  sort?: 'relevance' | 'hot' | 'top' | 'new' | 'comments';
  time?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
  includeComments?: boolean;
  commentsPerPost?: number;
};

type RedditListingChild = {
  data: {
    id: string;
    title?: string;
    selftext?: string;
    author?: string;
    permalink?: string;
    subreddit?: string;
    url?: string;
    created_utc?: number;
    num_comments?: number;
    score?: number;
    is_self?: boolean;
  };
};

type RedditListingResponse = {
  data?: {
    children?: RedditListingChild[];
  };
};

type RedditCommentChild = {
  kind?: string;
  data?: {
    id?: string;
    body?: string;
    author?: string;
    score?: number;
    created_utc?: number;
    replies?: RedditCommentTree | '';
  };
};

type RedditCommentTree = {
  data?: {
    children?: RedditCommentChild[];
  };
};

@Injectable()
export class RedditService {
  private readonly logger = new Logger(RedditService.name);
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly userAgent: string;

  constructor(private readonly configService: ConfigService) {
    this.clientId = this.configService.get<string>('app.redditClientId') ?? '';
    this.clientSecret = this.configService.get<string>('app.redditClientSecret') ?? '';
    this.userAgent =
      this.configService.get<string>('app.redditUserAgent') ??
      'problem-finder-ai/0.1 by problem_finder_ai';
  }

  async collectDocuments(
    query: string,
    config: RedditSourceConfig = {},
  ): Promise<NormalizedDocument[]> {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      return [];
    }

    const limit = this.clamp(config.limit ?? 10, 1, 25);
    const includeComments = config.includeComments ?? true;
    const commentsPerPost = this.clamp(config.commentsPerPost ?? 3, 0, 10);
    const sort = config.sort ?? 'relevance';
    const time = config.time ?? 'month';
    const subreddits = this.normalizeSubreddits(config.subreddits);

    const token = await this.getAccessToken();
    const posts = await this.searchPosts({
      query: normalizedQuery,
      subreddits,
      limit,
      sort,
      time,
      token,
    });

    const documents: NormalizedDocument[] = [];

    for (const post of posts) {
      const comments = includeComments
        ? await this.fetchTopComments(post.data.permalink, commentsPerPost, token)
        : [];

      const contentParts = [post.data.title?.trim(), post.data.selftext?.trim(), ...comments]
        .filter((value): value is string => Boolean(value && value.trim()))
        .map((value) => value.trim());

      documents.push({
        externalId: post.data.id,
        sourceType: SourceType.REDDIT,
        documentType: DocumentType.POST,
        title: post.data.title?.trim() || `Reddit post ${post.data.id}`,
        content: contentParts.join('\n\n'),
        author: post.data.author,
        url: post.data.permalink
          ? `https://www.reddit.com${post.data.permalink}`
          : post.data.url,
        publishedAt: post.data.created_utc
          ? new Date(post.data.created_utc * 1000)
          : undefined,
        metadata: {
          subreddit: post.data.subreddit,
          score: post.data.score,
          numComments: post.data.num_comments,
          commentSnippets: comments.length,
          originalUrl: post.data.url,
        },
      });
    }

    return documents.filter((document) => document.content.trim().length > 0);
  }

  private async searchPosts(input: {
    query: string;
    subreddits: string[];
    limit: number;
    sort: RedditSourceConfig['sort'];
    time: RedditSourceConfig['time'];
    token?: string;
  }): Promise<RedditListingChild[]> {
    const { query, subreddits, limit, sort, time, token } = input;

    if (subreddits.length > 0) {
      const results = await Promise.all(
        subreddits.map((subreddit) =>
          this.requestJson<RedditListingResponse>({
            path: `/r/${encodeURIComponent(subreddit)}/search.json`,
            params: {
              q: query,
              restrict_sr: '1',
              sort: sort ?? 'relevance',
              t: time ?? 'month',
              limit: String(limit),
              raw_json: '1',
            },
            token,
          }),
        ),
      );

      return results.flatMap((result) => result.data?.children ?? []);
    }

    const result = await this.requestJson<RedditListingResponse>({
      path: '/search.json',
      params: {
        q: query,
        sort: sort ?? 'relevance',
        t: time ?? 'month',
        limit: String(limit),
        raw_json: '1',
      },
      token,
    });

    return result.data?.children ?? [];
  }

  private async fetchTopComments(
    permalink: string | undefined,
    commentsPerPost: number,
    token?: string,
  ): Promise<string[]> {
    if (!permalink || commentsPerPost <= 0) {
      return [];
    }

    const response = await this.requestJson<[unknown, RedditCommentTree]>({
      path: `${permalink}.json`,
      params: {
        limit: String(commentsPerPost),
        depth: '2',
        sort: 'top',
        raw_json: '1',
      },
      token,
    });

    const commentsTree = Array.isArray(response) ? response[1] : undefined;
    return this.flattenCommentBodies(commentsTree, commentsPerPost);
  }

  private flattenCommentBodies(tree: RedditCommentTree | undefined, limit: number): string[] {
    const queue = [...(tree?.data?.children ?? [])];
    const comments: string[] = [];

    while (queue.length > 0 && comments.length < limit) {
      const current = queue.shift();

      if (!current || current.kind !== 't1' || !current.data?.body) {
        continue;
      }

      comments.push(current.data.body.trim());

      const replies = current.data.replies;
      if (replies && typeof replies !== 'string') {
        queue.push(...(replies.data?.children ?? []));
      }
    }

    return comments;
  }

  private async getAccessToken(): Promise<string | undefined> {
    if (!this.clientId || !this.clientSecret) {
      return undefined;
    }

    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': this.userAgent,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const body = await response.text();
      this.logger.warn(`Reddit OAuth token request failed: ${response.status} ${body}`);
      return undefined;
    }

    const json = (await response.json()) as { access_token?: string };
    return json.access_token;
  }

  private async requestJson<T>(input: {
    path: string;
    params?: Record<string, string>;
    token?: string;
  }): Promise<T> {
    const { path, params, token } = input;
    const searchParams = new URLSearchParams(params);
    const baseUrl = token ? 'https://oauth.reddit.com' : 'https://www.reddit.com';
    const response = await fetch(`${baseUrl}${path}?${searchParams.toString()}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': this.userAgent,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Reddit request failed: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  }

  private normalizeSubreddits(subreddits?: string[]) {
    return (subreddits ?? [])
      .map((subreddit) => subreddit.trim())
      .filter((subreddit) => subreddit.length > 0);
  }

  private clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }
}
