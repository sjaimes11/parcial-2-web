import { IsNotEmpty, IsString } from 'class-validator';

export class PacienteDto {
  @IsNotEmpty()
  @IsString()
  readonly nombre: string;

  @IsNotEmpty()
  @IsString()
  readonly genero: string;
}