import { registerAs } from '@nestjs/config';

type EnvInput = Record<string, string | undefined>;

export const appConfig = registerAs('app', () => ({
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  appOrigin: process.env.APP_ORIGIN ?? 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL ?? '',
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  openAiApiKey: process.env.OPENAI_API_KEY ?? '',
  openAiModel: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini',
  embeddingModel: process.env.EMBEDDING_MODEL ?? 'text-embedding-3-small',
  redditClientId: process.env.REDDIT_CLIENT_ID ?? '',
  redditClientSecret: process.env.REDDIT_CLIENT_SECRET ?? '',
  redditUserAgent:
    process.env.REDDIT_USER_AGENT ?? 'problem-finder-ai/0.1 by problem_finder_ai',
}));

export function validateEnv(config: EnvInput) {
  const required = ['DATABASE_URL', 'REDIS_URL'];

  for (const key of required) {
    if (!config[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return config;
}
