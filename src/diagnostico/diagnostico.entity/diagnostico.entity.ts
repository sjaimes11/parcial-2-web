import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { PacienteEntity } from '../../paciente/paciente.entity/paciente.entity';

@Entity()
export class DiagnosticoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @ManyToMany(() => PacienteEntity, paciente => paciente.diagnosticos)
  pacientes: PacienteEntity[];
}
