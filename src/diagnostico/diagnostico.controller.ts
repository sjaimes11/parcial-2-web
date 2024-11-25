import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    UseInterceptors,
  } from '@nestjs/common';
  import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
  import { DiagnosticoService } from './diagnostico.service';
  import { DiagnosticoDto } from './diagnostico.dto/diagnostico.dto';
  import { plainToInstance } from 'class-transformer';
  import { DiagnosticoEntity } from './diagnostico.entity/diagnostico.entity';
  
  @Controller('diagnosticos')
  @UseInterceptors(BusinessErrorsInterceptor)
  export class DiagnosticoController {
    constructor(private readonly diagnosticoService: DiagnosticoService) {}
  
    @Get()
    async findAll() {
      return this.diagnosticoService.findAll();
    }
  
    @Get('/:diagnosticoId')
    async findOne(@Param('diagnosticoId') diagnosticoId: string) {
      return this.diagnosticoService.findOne(diagnosticoId);
    }
  
    @Post()
    async create(@Body() diagnosticoDto: DiagnosticoDto) {
      const diagnostico = plainToInstance(DiagnosticoEntity, diagnosticoDto);
      return this.diagnosticoService.create(diagnostico);
    }
  
    @Delete(':diagnosticoId')
    @HttpCode(204)
    async delete(@Param('diagnosticoId') diagnosticoId: string) {
      return this.diagnosticoService.delete(diagnosticoId);
    }
  }