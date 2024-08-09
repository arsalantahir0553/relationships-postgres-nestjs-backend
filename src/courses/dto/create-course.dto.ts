import {
  IsString,
  IsOptional,
  IsInt,
  IsArray,
  IsNumber,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title: string; // Title of the course

  @IsString()
  description: string; // Description of the course

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  userIds?: number[];
}
