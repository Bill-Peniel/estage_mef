import { IsUUID, IsInt, IsOptional } from 'class-validator';

export class AssignStagiaireDto {
  @IsUUID()
  stagiaireId: string;

  @IsInt()
  structureId: number;

  @IsUUID()
  @IsOptional()
  tuteurId?: string;
} 