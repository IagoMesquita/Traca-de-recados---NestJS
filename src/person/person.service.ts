import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { HasingServiceProtocol } from 'src/auth/hasing/hashing.protocol.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly hashingService: HasingServiceProtocol,
  ) {}

  async create(createPersonDto: CreatePersonDto) {
    try {
      const { password } = createPersonDto;
      const passwordHash = await this.hashingService.toHash(password);

      const personToEntity = {
        name: createPersonDto.name,
        passwordHash,
        email: createPersonDto.email,
      };

      const newPerson = this.personRepository.create(personToEntity);

      return await this.personRepository.save(newPerson);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          `Email ja esta cadastrado: ${createPersonDto.email}}`,
        );
      }

      throw error;
    }
  }

  async findAll(): Promise<Person[]> {
    const personsDB = await this.personRepository.find({
      order: {
        id: 'DESC',
      },
    });

    return personsDB;
  }

  async findOne(id: number): Promise<Person> {
    const personDB = await this.personRepository.findOne({ where: { id } });

    if (!personDB) {
      throw new NotFoundException(`Pessoa nao encontrada para ID: ${id}`);
    }

    return personDB;
  }

  async update(
    id: number,
    updatePersonDto: UpdatePersonDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const passwordHash = await this.hashingService.toHash(
      updatePersonDto?.password,
    );

    const partialUpdatePerson = {
      name: updatePersonDto?.name,
      passwordHash,
    };

    const updatedPersonInstance = this.personRepository.create({
      id,
      ...partialUpdatePerson,
    });

    if (!updatedPersonInstance) {
      throw new NotFoundException(`Usuario para ID ${id} nao encontrado`);
    }

    if (tokenPayload.sub !== id) {
      throw new ForbiddenException('Esse nao e seu usuario.');
    }

    return this.personRepository.save(updatedPersonInstance);
  }

  async remove(
    id: number,
    tokenPayload: TokenPayloadDto,
  ): Promise<{ menssage: string }> {
    const personDB = await this.findOne(id);

    if (tokenPayload.sub !== id) {
      throw new ForbiddenException('Esse nao e seu usuario.');
    }

    await this.personRepository.remove(personDB);

    return {
      menssage: `Usuario deletado Id: ${id}`,
    };
  }

  async uploadPicture(
    file: Express.Multer.File,
    tokenPayload: TokenPayloadDto,
  ) {
    if (file.size < 1024) {
      throw new BadRequestException('File too small');
    }

    const personDb = await this.findOne(tokenPayload.sub);

    const fileExtension = path
      .extname(file.originalname)
      .toLowerCase()
      .substring(1);

    const fileName = `${tokenPayload.sub}.${fileExtension}`;
    const fileFullPath = path.resolve(process.cwd(), 'pictures', fileName);

    await fs.writeFile(fileFullPath, file.buffer);

    personDb.picture = fileName;
    this.personRepository.save(personDb);

    return personDb;
  }
}
