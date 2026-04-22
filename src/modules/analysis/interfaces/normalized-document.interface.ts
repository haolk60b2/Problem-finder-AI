import { DocumentType } from 'src/common/enums/document-type.enum';
import { SourceType } from 'src/common/enums/source-type.enum';

export interface NormalizedDocument {
  externalId: string;
  sourceType: SourceType;
  documentType: DocumentType;
  title?: string;
  content: string;
  author?: string;
  url?: string;
  publishedAt?: Date;
  metadata?: Record<string, unknown>;
}

