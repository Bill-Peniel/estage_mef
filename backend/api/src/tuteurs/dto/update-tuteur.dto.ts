import { IsEmail, IsString, IsOptional, MinLength, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateTuteurDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsString()
  @IsOptional()
  nom?: string;

  @IsString()
  @IsOptional()
  prenom?: string;

  @IsString()
  @IsOptional()
  telephone?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => value ? Number(value) : undefined)
  structureId?: number;
} 