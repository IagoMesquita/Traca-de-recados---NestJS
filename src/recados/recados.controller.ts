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
import { RecadosService } from './recados.service';
import { Recado } from './entities/recado.entity';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';

@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}
  
  @Get()
  findAll(): Promise<Recado[]> {
    return this.recadosService.findAll();
  }

  // Query Parameters
  @Get('pages')
  findAllByPage(@Query() pagination: any): string {
    console.log(pagination);
    const { limite = 10, offset = 5, length = 15 } = pagination;
    return `Os valores sao limite: ${limite} offset: ${offset} length: ${length}`;
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Recado> {
    return this.recadosService.findOne(id);
  }

  @Post()
  create(@Body() novoRecado: CreateRecadoDto) {
    return this.recadosService.addRecado(novoRecado);
  }


  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() recado: UpdateRecadoDto) {
    return this.recadosService.update(+id, recado)
    
  }

  // @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string): Promise<{ message: string }> {
    return this.recadosService.remove(+id);
  }
}

// Decorete para alterar status code
// @HttpCode(200)

// Enum de status
// @HttpCode(HttpStatus.CREATED)
