import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';

export class CreateStructureDto {
  @IsString()
  @IsNotEmpty()
  nomStructure: string;

  @IsString()
  @IsOptional()
  sigle?: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['directionnelle', 'technique'])
  type: 'directionnelle' | 'technique';

  @IsOptional()
  @IsNumber()
  parentId?: number;
} 