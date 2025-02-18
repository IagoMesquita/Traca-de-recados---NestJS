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
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

// @UsePipes(ParseIntIdPipe)
// @UseInterceptors(AuthTokenInterceptor)
@Controller('recados')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  findAll(
    @Query() pagination?: PaginationDTO,
  ): Promise<{ totalMessages: number; data: Message[] }> {
    return this.messageService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Message> {
    return this.messageService.findOne(id);
  }

  @UseGuards(AuthTokenGuard)
  @Post()
  create(
    @Body() novoMessage: CreateMessageDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.messageService.addMessage(novoMessage, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() recado: UpdateMessageDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.messageService.update(+id, recado, tokenPayload);
  }

  // @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ): Promise<{ message: string }> {
    return this.messageService.remove(+id, tokenPayload);
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
