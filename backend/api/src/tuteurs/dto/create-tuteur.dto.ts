import { IsEmail, IsString, IsNotEmpty, MinLength, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTuteurDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  prenom: string;

  @IsString()
  @IsOptional()
  telephone?: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  structureId: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return null;
    }
    return Number(value);
  })
  sousStructureId?: number | null;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return null;
    }
    return Number(value);
  })
  serviceId?: number | null;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['tuteur', 'agent'])
  role: 'tuteur' | 'agent';
} 