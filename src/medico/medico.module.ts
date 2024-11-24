import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoEntity } from './medico.entity/medico.entity';
import { MedicoService } from './medico.service';
import { MedicoController } from './medico.controller';

@Module({
    imports: [TypeOrmModule.forFeature([MedicoEntity])],
    controllers: [MedicoController],
    providers: [MedicoService],
  })
export class MedicoModule {}
