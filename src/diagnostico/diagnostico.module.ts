import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticoEntity } from './diagnostico.entity/diagnostico.entity';
import { DiagnosticoService } from './diagnostico.service';
import { DiagnosticoController } from './diagnostico.controller';


@Module({
    imports: [TypeOrmModule.forFeature([DiagnosticoEntity])],
    controllers: [DiagnosticoController],
    providers: [DiagnosticoService],
  })
export class DiagnosticoModule {}
