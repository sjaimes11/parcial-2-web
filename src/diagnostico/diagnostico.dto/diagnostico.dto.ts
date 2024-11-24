import { IsNotEmpty, IsString } from 'class-validator';
export class DiagnosticoDto {
  @IsNotEmpty()
  @IsString()
  readonly nombre: string;

  @IsNotEmpty()
  @IsString()
  readonly descripcion: string;
}