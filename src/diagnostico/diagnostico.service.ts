import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosticoEntity } from './diagnostico.entity/diagnostico.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';


@Injectable()
export class DiagnosticoService {
  constructor(
    @InjectRepository(DiagnosticoEntity)
    private readonly diagnosticoRepository: Repository<DiagnosticoEntity>,
  ) {}

  async findAll(): Promise<DiagnosticoEntity[]> {
    return await this.diagnosticoRepository.find();
  }

  async findOne(id: string): Promise<DiagnosticoEntity> {
    const diagnostico = await this.diagnosticoRepository.findOne({
      where: { id },
      relations: ['pacientes'], // Relación con pacientes
    });

    if (!diagnostico) {
      throw new BusinessLogicException(
        'The diagnosis with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    return diagnostico;
  }

  async create(diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
    // Validar que la descripción tenga como máximo 200 caracteres
    if (diagnostico.descripcion.length > 200) {
      throw new BusinessLogicException(
        'The description must not exceed 200 characters',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return await this.diagnosticoRepository.save(diagnostico);
  }

  async delete(id: string): Promise<void> {
    const diagnostico = await this.diagnosticoRepository.findOne({
      where: { id }, relations: ['pacientes'], // Relación con pacientes
    });

    if (!diagnostico) {
      throw new BusinessLogicException(
        'The diagnosis with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    await this.diagnosticoRepository.remove(diagnostico);
  }
}
