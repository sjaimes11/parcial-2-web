import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { MedicoEntity } from '../../medico/medico.entity/medico.entity';
import { DiagnosticoEntity } from '../../diagnostico/diagnostico.entity/diagnostico.entity';

@Entity()
export class PacienteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  genero: string;

  @ManyToMany(() => MedicoEntity, medico => medico.pacientes)
  @JoinTable() // Crea la tabla intermedia para la relación Paciente-Medico
  medicos: MedicoEntity[];

  @ManyToMany(() => DiagnosticoEntity, diagnostico => diagnostico.pacientes)
  @JoinTable() // Crea la tabla intermedia para la relación Paciente-Diagnostico
  diagnosticos: DiagnosticoEntity[];
}
