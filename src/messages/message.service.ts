import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import { Message } from './entities/message';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PersonService } from 'src/person/person.service';
import { Person } from '../person/entities/person.entity';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private readonly personService: PersonService,
  ) {}

  async addMessage(
    createMessageDto: CreateMessageDto,
  ): Promise<ResponseMessageDTO> {
    const { fromId, toId, text } = createMessageDto;

    const userFromDb = await this.personService.findOne(fromId);
    const userToDb = await this.personService.findOne(toId);

    const newMessage = {
      text,
      from: userFromDb,
      to: userToDb,
      // isRead: false,
      // date: new Date()
    };

    const message = this.messageRepository.create(newMessage);

    await this.messageRepository.save(message);

    return {
      ...message,
      from: {
        id: userFromDb.id,
      },
      to: {
        id: userToDb.id,
      },
    };
  }

  //Nos metodos do repositiry da para configurar relacoes e response
  async findAll(
    paginationDTO?: PaginationDTO,
  ): Promise<{ totalMessages: number; data: Message[] }> {
    const { limite = 10, offset = 0 } = paginationDTO;

    const messagesDB = await this.messageRepository.find({
      take: limite, // Quantos registros serao exibidos (por pagina)
      skip: offset, // Quantos registros devem ser pulados,
      relations: ['from', 'to'],
      select: {
        from: {
          id: true,
          name: true,
        },
        to: {
          id: true,
          name: true,
        },
      },
    });

    const totalMessages = await this.messageRepository.count();

    return { totalMessages, data: messagesDB };
  }

  async findOne(id: number): Promise<Message> {
    const messageDB = await this.messageRepository.findOne({
      where: { id },
      relations: ['from', 'to'],
      select: {
        from: {
          id: true,
          email: true,
        },
        to: {
          id: true,
          name: true,
        },
      },
    });
    if (!messageDB) {
      // throw new Error('Erro do servidor'); VAI GERAR UM 500
      // throw new HttpException(`Usuario de ID ${id} nao encontrado`, HttpStatus.NOT_FOUND); Forma Geral
      // Mais especifica
      throw new NotFoundException(`Recado para ID ${id} nao encontrado`);
    }

    return messageDB;
  }

  async update(id: number, updateMessage: UpdateMessageDto): Promise<Message> {
    const messageDb = await this.findOne(id);

    // const partialUpdateMessage = {
    //   isRead: updateMessage?.isRead,
    //   text: updateMessage?.text,
    // }

    const isRead = updateMessage.isRead
      ? updateMessage.isRead
      : messageDb.isRead;
    const text = updateMessage.text ? updateMessage.text : messageDb.text;

    const updatedMessage = {
      ...messageDb,
      isRead,
      text,
    };

    // const updated = this.recadoRepository.update(id, updateRecado); Apenas atualiza

    // const updatedRecado = await this.recadoRepository.save({
    //   ...recadoDB,
    //   ...updateRecado,
    // })

    //preload nao tras a relacoes, por isso vou usar findOne
    // const updatedMessageInstace = await this.messageRepository.preload({
    //   id, // Garante que estamos mesclando com a entidade existente
    //   ...partialUpdateMessage, // Atualiza os campos necessários
    // });

    // if (!updatedMessageInstace) {
    //   throw new NotFoundException(`Recado para ID ${id} nao encontrado`);
    // }

    return this.messageRepository.save(updatedMessage);
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);

    await this.messageRepository.delete(id);
    return { message: `Recado de ID ${id}, Deletado` };
  }
}
