import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity/paciente.entity';
import { PacienteService } from './paciente.service';
import { PacienteController } from './paciente.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PacienteEntity])],
  providers: [PacienteService],
  exports: [PacienteService],
  controllers: [PacienteController],
})
export class PacienteModule {}