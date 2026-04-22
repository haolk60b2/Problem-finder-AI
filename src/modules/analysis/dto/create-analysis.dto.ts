import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ProjectLanguage } from 'src/common/enums/project-language.enum';
import { SourceType } from 'src/common/enums/source-type.enum';

export class CreateAnalysisDto {
  @IsString()
  @MinLength(3)
  projectId!: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  niche?: string;

  @IsOptional()
  @IsEnum(ProjectLanguage)
  language?: ProjectLanguage;

  @IsOptional()
  @IsArray()
  @IsEnum(SourceType, { each: true })
  sourceTypes?: SourceType[];

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
