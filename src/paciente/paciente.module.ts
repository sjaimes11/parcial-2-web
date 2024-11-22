import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity/paciente.entity';
import { PacienteService } from './paciente.service';
import { MedicoEntity } from 'src/medico/medico.entity/medico.entity';
import { PacienteMedicoService } from 'src/paciente-medico/paciente-medico.service';
import { DiagnosticoEntity } from 'src/diagnostico/diagnostico.entity/diagnostico.entity';



@Module({
    imports: [TypeOrmModule.forFeature([PacienteEntity, MedicoEntity, DiagnosticoEntity])],
    controllers: [],
    providers: [PacienteService, PacienteMedicoService],
    exports: [PacienteService]
  })
export class PacienteModule {}
