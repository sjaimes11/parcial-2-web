import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoEntity } from './medico.entity/medico.entity';
import { MedicoService } from './medico.service';

@Module({
    imports: [TypeOrmModule.forFeature([MedicoEntity])],
    controllers: [],
    providers: [MedicoService],
  })
export class MedicoModule {}
