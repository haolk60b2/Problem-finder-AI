import { IsArray, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ProjectLanguage } from 'src/common/enums/project-language.enum';
import { SourceType } from 'src/common/enums/source-type.enum';

export class CreateProjectDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsString()
  @MinLength(2)
  niche!: string;

  @IsEnum(ProjectLanguage)
  language!: ProjectLanguage;

  @IsOptional()
  @IsArray()
  @IsEnum(SourceType, { each: true })
  sourceTypes?: SourceType[];
}
