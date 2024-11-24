import { IsNotEmpty, IsString } from 'class-validator';
export class MedicoDto {
  @IsNotEmpty()
  @IsString()
  readonly nombre: string;

  @IsNotEmpty()
  @IsString()
  readonly especialidad: string;

  @IsNotEmpty()
  @IsString()
  readonly telefono: string;
}