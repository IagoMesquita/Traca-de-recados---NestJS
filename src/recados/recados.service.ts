import { Injectable, NotFoundException } from '@nestjs/common';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { UpdateRecadoDto } from './dto/update-recado.dto';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private recadoRepository: Repository<Recado>,
  ) {}

  addRecado(novoRecado: CreateRecadoDto): Promise<Recado> {
    const recado = this.recadoRepository.create(novoRecado);

    return this.recadoRepository.save(recado);
  }

  async findAll(): Promise<Recado[]> {
    const recadosDB = await this.recadoRepository.find();

    return recadosDB;
  }

  async findOne(id: number): Promise<Recado> {
    const recadoDB = await this.recadoRepository.findOne({ where: { id } });
    if (!recadoDB) {
      // throw new Error('Erro do servidor'); VAI GERAR UM 500
      // throw new HttpException(`Usuario de ID ${id} nao encontrado`, HttpStatus.NOT_FOUND); Forma Geral
      // Mais especifica
      throw new NotFoundException(`Recado para ID ${id} nao encontrado`);
    }

    return recadoDB;
  }

  async update(id: number, updateRecado: UpdateRecadoDto): Promise<Recado> {
    //Regra: Apenas essas propriedades podem ser alteradas
    const partialUpdateRecado = {
      lido: updateRecado?.lido,
      texto: updateRecado?.texto
    }

    // const updated = this.recadoRepository.update(id, updateRecado); Apenas atualiza

    // const updatedRecado = await this.recadoRepository.save({
    //   ...recadoDB,
    //   ...updateRecado,
    // })

    const updatedRecadoInstace = await this.recadoRepository.preload({
      id, // Garante que estamos mesclando com a entidade existente
      ...partialUpdateRecado // Atualiza os campos necessários
    });

    if(!updatedRecadoInstace) {
      throw new NotFoundException(`Recado para ID ${id} nao encontrado`);
    }

    return this.recadoRepository.save(updatedRecadoInstace);
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);

    await this.recadoRepository.delete(id);
    return {message: `Rcado de ID ${id}, Deletado`};
  }
}
