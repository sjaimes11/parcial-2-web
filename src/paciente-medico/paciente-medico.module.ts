import { Module } from '@nestjs/common';
import { PacienteMedicoService } from './paciente-medico.service';
import { PacienteMedicoController } from './paciente-medico.controller';
import { PacienteEntity } from 'src/paciente/paciente.entity/paciente.entity';
import { MedicoEntity } from 'src/medico/medico.entity/medico.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PacienteEntity, MedicoEntity])],
  providers: [PacienteMedicoService],
  controllers: [PacienteMedicoController],
})
export class PacienteMedicoModule {}
