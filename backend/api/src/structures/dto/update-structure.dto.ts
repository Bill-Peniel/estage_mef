import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateStructureDto {
  @IsOptional()
  @IsString()
  nomStructure?: string;

  @IsOptional()
  @IsString()
  sigle?: string;

  @IsOptional()
  @IsNumber()
  parentId?: number;
} 