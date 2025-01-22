import { Injectable, NotFoundException } from '@nestjs/common';
import { Message } from './entities/message';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  addMessage(newMessage: CreateMessageDto): Promise<Message> {

    const message = this.messageRepository.create(newMessage);

    return this.messageRepository.save(message);
  }

  async findAll(): Promise<Message[]> {
    const messagesDB = await this.messageRepository.find();

    return messagesDB;
  }

  async findOne(id: number): Promise<Message> {
    const messageDB = await this.messageRepository.findOne({ where: { id } });
    if (!messageDB) {
      // throw new Error('Erro do servidor'); VAI GERAR UM 500
      // throw new HttpException(`Usuario de ID ${id} nao encontrado`, HttpStatus.NOT_FOUND); Forma Geral
      // Mais especifica
      throw new NotFoundException(`Recado para ID ${id} nao encontrado`);
    }

    return messageDB;
  }

  async update(id: number, updateMessage: UpdateMessageDto): Promise<Message> {
    //Regra: Apenas essas propriedades podem ser alteradas
    const partialUpdateMessage = {
      lido: updateMessage?.isRead,
      texto: updateMessage?.text
    }

    // const updated = this.recadoRepository.update(id, updateRecado); Apenas atualiza

    // const updatedRecado = await this.recadoRepository.save({
    //   ...recadoDB,
    //   ...updateRecado,
    // })

    const updatedMessageInstace = await this.messageRepository.preload({
      id, // Garante que estamos mesclando com a entidade existente
      ...partialUpdateMessage // Atualiza os campos necessários
    });

    if(!updatedMessageInstace) {
      throw new NotFoundException(`Recado para ID ${id} nao encontrado`);
    }

    return this.messageRepository.save(updatedMessageInstace);
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);

    await this.messageRepository.delete(id);
    return {message: `Recado de ID ${id}, Deletado`};
  }
}
