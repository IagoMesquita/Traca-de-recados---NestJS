import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './entities/message';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

// @UsePipes(ParseIntIdPipe)
// @UseInterceptors(AuthTokenInterceptor)
@Controller('recados')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Query() pagination?: PaginationDTO,
  ): Promise<{ totalMessages: number; data: Message[] }> {
    return this.messageService.findAll(pagination);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: number): Promise<Message> {
    return this.messageService.findOne(id);
  }

  @Post()
  create(@Body() novoMessage: CreateMessageDto) {
    return this.messageService.addMessage(novoMessage);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() recado: UpdateMessageDto) {
    return this.messageService.update(+id, recado);
  }

  // @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.messageService.remove(+id);
  }
}

// Decorete para alterar status code
// @HttpCode(200)

// Enum de status
// @HttpCode(HttpStatus.CREATED)

// Pipes: de validacao, transformacao e valiacao/transformacao
//    Global com app.useGlobalPipes(new ValidationPipe({}))
//    No controller glogal usando, ou no metodo @UsePipes(ParseIntPipe)
//    Como parametro findOne(@Param('id', ParseIntPipe) id: number)
//    Como objeto parametro, para usar mais propriendafe
//        findOne(@Param('id', new ParseIntPipe({})) id: number)
