import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Request } from 'express';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('persons')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }

  @Get()
  findAll() {
    return this.personService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    console.log('PessoasControllerFindOne', req['user']);
    return this.personService.findOne(+id);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePersonDto: UpdatePersonDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    console.log('tokenPayload', tokenPayload);
    return this.personService.update(+id, updatePersonDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.personService.remove(+id, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Post('upload-picture')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPicture(
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpeg|jpg|png/g,
        })
        .addMaxSizeValidator({
          maxSize: 10 * (1024 * 1024),
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.personService.uploadPicture(file, tokenPayload);
  }
}

// File upload
// https://docs.nestjs.com/techniques/file-upload
