import { Injectable } from '@nestjs/common';
import { PacienteEntity } from './paciente.entity/paciente.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PacienteService {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,
  ) {}

  async findAll(): Promise<PacienteEntity[]> {
    return this.pacienteRepository.find();
  }

  async findOne(id: string): Promise<PacienteEntity> {
    const paciente = await this.pacienteRepository.findOne({
      where: { id },
      relations: ['diagnosticos', 'medicos'],
    });

    if (!paciente) {
      throw new BusinessLogicException(
        'El paciente con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    return paciente;
  }

  async create(paciente: PacienteEntity): Promise<PacienteEntity> {
    if (paciente.nombre.length < 3) {
      throw new BusinessLogicException(
        'El nombre del paciente debe tener al menos 3 caracteres',
        BusinessError.BAD_REQUEST,
      );
    }
    return this.pacienteRepository.save(paciente);
  }

  async delete(id: string): Promise<void> {
    const paciente = await this.pacienteRepository.findOne({
      where: { id },
      relations: ['diagnosticos', 'medicos'],
    });
    if (!paciente) {
      throw new BusinessLogicException(
        'El paciente con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    if (paciente.diagnosticos.length > 0) {
      throw new BusinessLogicException(
        'No se puede eliminar un paciente con diagnósticos asociados',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    await this.pacienteRepository.delete(paciente.id);
  }
}