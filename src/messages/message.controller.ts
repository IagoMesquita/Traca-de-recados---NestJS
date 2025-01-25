import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './entities/message';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

@Controller('recados')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  findAll(
    @Query() pagination?: PaginationDTO,
  ): Promise<{ totalMessages: number, data: Message[] }> {
    return this.messageService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Message> {
    return this.messageService.findOne(id);
  }

  @Post()
  create(@Body() novoMessage: CreateMessageDto) {
    return this.messageService.addMessage(novoMessage);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() recado: UpdateMessageDto,
  ) {
    return this.messageService.update(+id, recado);
  }

  // @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string): Promise<{ message: string }> {
    return this.messageService.remove(+id);
  }
}

// Decorete para alterar status code
// @HttpCode(200)

// Enum de status
// @HttpCode(HttpStatus.CREATED)
