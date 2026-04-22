import { IsEnum, IsObject, IsString } from 'class-validator';
import { SourceType } from 'src/common/enums/source-type.enum';

export class CreateSourceDto {
  @IsString()
  projectId!: string;

  @IsEnum(SourceType)
  type!: SourceType;

  @IsObject()
  configJson!: Record<string, unknown>;
}
