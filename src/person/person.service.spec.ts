import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';
import { PersonService } from './person.service';
import { Test, TestingModule } from '@nestjs/testing';
import { HasingServiceProtocol } from 'src/auth/hasing/hashing.protocol.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePersonDto } from './dto/update-person.dto';
import * as path from 'path';
import * as fs from 'fs/promises';

jest.mock('fs/promises'); // Mocka todo o modulo fs

describe('Person Service', () => {
  let personService: PersonService;
  let personRepository: Repository<Person>;
  let hashingService: HasingServiceProtocol;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        {
          provide: getRepositoryToken(Person),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: HasingServiceProtocol,
          useValue: {
            toHash: jest.fn(),
          },
        },
      ],
      // imports: [PersonRepository],
    }).compile();

    personService = moduleRef.get<PersonService>(PersonService);
    personRepository = moduleRef.get<Repository<Person>>(
      getRepositoryToken(Person),
    );
    hashingService = moduleRef.get<HasingServiceProtocol>(
      HasingServiceProtocol,
    );
  });

  it('check if person is defined', () => {
    expect(personService).toBeDefined();
  });

  describe('create', () => {
    it('must create a new person', async () => {
      // CreatePersonDto
      // Que o hashingService tenha o metodo hash
      // Saber se o hashing service foi chamado com CreatePersonDto
      // Saber se o pesersonRepository.create foi chamado com dados person
      // Sabser se personRepository.save foi chamado com a person criada
      // O retorno final deve ser a nova person criada -> expect

      // ARRANGE
      const createPersonDto: CreatePersonDto = {
        email: 'jh@gmail.com',
        name: 'Joao Heleno',
        password: '010203',
      };
      const passwordHash = 'HASHDESENHA';

      const newPerson = {
        id: 1,
        email: 'jh@gmail.com',
        name: 'Joao Heleno',
        passwordHash,
      };

      jest.spyOn(hashingService, 'toHash').mockResolvedValue(passwordHash);
      jest.spyOn(personRepository, 'create').mockReturnValue(newPerson as any);
      jest.spyOn(personRepository, 'save').mockResolvedValue(newPerson as any);

      //ACT
      const response = await personService.create(createPersonDto);

      // ASSERT
      expect(hashingService.toHash).toHaveBeenCalledTimes(1);
      expect(hashingService.toHash).toHaveBeenCalledWith(
        createPersonDto.password,
      );

      expect(personRepository.create).toHaveBeenCalledTimes(1);
      expect(personRepository.create).toHaveBeenCalledWith({
        email: 'jh@gmail.com',
        name: 'Joao Heleno',
        passwordHash: 'HASHDESENHA',
      });

      expect(personRepository.save).toHaveBeenCalledTimes(1);
      expect(personRepository.save).toHaveBeenCalledWith(newPerson);
      expect(response).toEqual(newPerson);
    });

    it('should throw ConflictException when email already exists', async () => {
      jest.spyOn(personRepository, 'save').mockRejectedValue({
        code: '23505',
      });

      await expect(personService.create({} as any)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw Exception for a generic error', async () => {
      jest
        .spyOn(personRepository, 'save')
        .mockRejectedValue(new Error('Erro generico'));

      await expect(personRepository.save).rejects.toThrow(
        new Error('Erro generico'),
      );
    });
  });

  describe('findOne', () => {
    it('must find a user by id', async () => {
      const userId = 1;
      const personFound = {
        id: 1,
        name: 'Jaoa',
        email: 'jaoa@gmail.com',
        passwordHash: 'SENHAHASH',
      };

      jest
        .spyOn(personRepository, 'findOne')
        .mockResolvedValue(personFound as any);

      const response = await personService.findOne(userId);

      expect(personRepository.findOne).toHaveBeenCalledTimes(1);
      expect(personRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });

      expect(response).toEqual(personFound);
    });

    it('should throw a NotFoundException when user is not found', async () => {
      await expect(personService.findOne(1)).rejects.toThrow(
        new NotFoundException('Pessoa nao encontrada para ID: 1'),
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of persons ordered by id DESC', async () => {
      const personsMock = [
        {
          id: 1,
          name: 'Joao',
          email: 'jaoa@gmail.com',
          passwordHash: 'SENHAHASH',
        },
        {
          id: 2,
          name: 'Helena',
          email: 'jaoa@gmail.com',
          passwordHash: 'SENHAHASH',
        },
        {
          id: 3,
          name: 'Emilly',
          email: 'jaoa@gmail.com',
          passwordHash: 'SENHAHASH',
        },
      ];

      jest
        .spyOn(personRepository, 'find')
        .mockResolvedValue(personsMock as any);

      const response = await personService.findAll();

      expect(personRepository.find).toHaveBeenCalledWith({
        order: {
          id: 'DESC',
        },
      });
      expect(response).toEqual(personsMock);
    });

    it('checks when it returns an empty list', async () => {
      const listEmpty = [];

      jest.spyOn(personRepository, 'find').mockResolvedValue(listEmpty as any);

      const response = await personService.findAll();

      expect(response).toEqual(listEmpty as any);
    });
  });

  describe('update', () => {
    it('checks if data is updated correctly for authenticated user', async () => {
      const mockId = 1;
      const updatePersonMock: UpdatePersonDto = {
        name: 'Joao',
        // email: 'joao@gmail.com',
        password: 'password',
      };
      const passwordHashMock: any = 'SENHAHASH';
      const tokenPayloadMock = { sub: mockId };
      const updatedPersonMock = {
        id: mockId,
        name: 'Joao',
        passwordHash: passwordHashMock,
      };

      jest.spyOn(hashingService, 'toHash').mockResolvedValue(passwordHashMock);
      jest
        .spyOn(personRepository, 'create')
        .mockReturnValue(updatedPersonMock as any);
      jest
        .spyOn(personRepository, 'save')
        .mockResolvedValue(updatedPersonMock as any);

      const response = await personService.update(
        mockId,
        updatePersonMock,
        tokenPayloadMock as any,
      );

      expect(hashingService.toHash).toHaveBeenCalledTimes(1);
      expect(hashingService.toHash).toHaveBeenCalledWith(
        updatePersonMock.password,
      );

      expect(personRepository.create).toHaveBeenCalledTimes(1);
      expect(personRepository.create).toHaveBeenCalledWith({
        id: mockId,
        name: 'Joao',
        passwordHash: passwordHashMock,
      });

      expect(personRepository.save).toHaveBeenCalledTimes(1);
      expect(personRepository.save).toHaveBeenCalledWith(updatedPersonMock);

      expect(response).toEqual(updatedPersonMock);
    });

    it('should throw NotFoundException if user not found', async () => {
      // Arrange
      const mockId = 1;
      const updatePersonMock: UpdatePersonDto = {
        name: 'Joao',
        password: 'password',
      };
      const tokenPayloadMock = { sub: mockId } as any;

      // Simula que o create retorna null.
      jest.spyOn(personRepository, 'create').mockReturnValue(null);

      // Action e Assert
      await expect(
        personService.update(mockId, updatePersonMock, tokenPayloadMock),
      ).rejects.toThrow(
        new NotFoundException(`Usuario para ID ${mockId} nao encontrado`),
      );

      // Action e Assert Usando try/catch
      try {
        await personService.update(mockId, updatePersonMock, tokenPayloadMock);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`Usuario para ID ${mockId} nao encontrado`);
      }
    });

    it('should throw ForbiddenException if unauthorized user', async () => {
      // Arrange
      const mockId = 1;
      const updatePersonMock: UpdatePersonDto = {
        name: 'Joao',
        password: 'password',
      };
      const passwordHashMock: any = 'SENHAHASH';
      const tokenPayloadMock = { sub: 2 } as any;
      const updatedPersonMock = {
        id: mockId,
        name: 'Joao',
        passwordHash: passwordHashMock,
      } as any;

      // Act
      jest.spyOn(personRepository, 'create').mockReturnValue(updatedPersonMock);

      // Assert
      await expect(
        personService.update(mockId, updatePersonMock, tokenPayloadMock),
      ).rejects.toThrow(new ForbiddenException('Esse nao e seu usuario.'));
    });

    describe('remove', () => {
      it('must remove a person if authorized', async () => {
        const mockId = 1;
        const tokenPayloadMock = { sub: mockId } as any;
        const passwordHashMock: any = 'SENHAHASH';
        const updatedPersonMock = {
          id: mockId,
          name: 'Joao',
          passwordHash: passwordHashMock,
        } as any;

        jest
          .spyOn(personService, 'findOne')
          .mockResolvedValue(updatedPersonMock);
        jest
          .spyOn(personRepository, 'remove')
          .mockReturnValue(updatedPersonMock);

        const result = await personService.remove(mockId, tokenPayloadMock);

        expect(personService.findOne).toHaveBeenCalledTimes(1);
        expect(personService.findOne).toHaveBeenCalledWith(mockId);

        expect(personRepository.remove).toHaveBeenCalledTimes(1);
        expect(personRepository.remove).toHaveBeenCalledWith(updatedPersonMock);

        expect(result).toEqual({
          menssage: `Usuario deletado Id: ${mockId}`,
        });
      });

      it('should throw NotFoundException if the person is not found', async () => {
        const mockId = 1;

        jest
          .spyOn(personService, 'findOne')
          .mockRejectedValue(
            new NotFoundException(`Pessoa nao encontrada para ID: ${mockId}`),
          );
      });

      it('should throw ForbiddenException if not authorized', async () => {
        const mockId = 1;
        const tokenPayloadMock = { sub: 2 } as any;
        const passwordHashMock: any = 'SENHAHASH';
        const foundedPersonMock = {
          id: mockId,
          name: 'Joao',
          passwordHash: passwordHashMock,
        } as any;

        jest
          .spyOn(personService, 'findOne')
          .mockResolvedValue(foundedPersonMock);

        await expect(
          personService.remove(mockId, tokenPayloadMock),
        ).rejects.toThrow(new ForbiddenException('Esse nao e seu usuario.'));
      });
    });

    // Upload Picture
    describe('uploadPicture', () => {
      it('must save the image correctly and update the person', async () => {
        const mockId = 1;
        const passwordHashMock: any = 'SENHAHASH';

        const tokenPayloadMock = { sub: mockId } as any;
        const fileMock = {
          originalname: 'test.png',
          size: 2000,
          buffer: Buffer.from('file content'),
        } as Express.Multer.File;

        const foundPersonMock = {
          id: mockId,
          name: 'Joao',
          passwordHash: passwordHashMock,
        } as Person;

        jest.spyOn(personService, 'findOne').mockResolvedValue(foundPersonMock);
        jest.spyOn(personRepository, 'save').mockResolvedValue({
          ...foundPersonMock,
          picture: 'photo.png',
        });
        const filePath = path.resolve(process.cwd(), 'pictures', '1.png');

        const result = await personService.uploadPicture(
          fileMock,
          tokenPayloadMock,
        );

        expect(fs.writeFile).toHaveBeenCalledTimes(1);
        expect(fs.writeFile).toHaveBeenCalledWith(filePath, fileMock.buffer);

        expect(personService.findOne).toHaveBeenCalledTimes(1);
        expect(personService.findOne).toHaveBeenCalledWith(
          tokenPayloadMock.sub,
        );

        expect(personRepository.save).toHaveBeenCalledTimes(1);
        expect(personRepository.save).toHaveBeenCalledWith({
          ...foundPersonMock,
          picture: '1.png',
        });

        expect(result).toEqual({ ...foundPersonMock, picture: '1.png' });
      });

      it('should throw BadRequestException if file is too small', async () => {
        const mockFile = { size: 1023 } as Express.Multer.File;
        const tokenPayloadMock = { sub: 1 } as any;

        await expect(
          personService.uploadPicture(mockFile, tokenPayloadMock),
        ).rejects.toThrow(new BadRequestException('File too small'));
      });

      it('should throw NotFoundException if the person is not found', async () => {
        
      });
    });
  });
});

describe('Conceito de AAA para testes', () => {
  it('deve multiplicar 2 num e resultar em 18', () => {
    // configurar - Arrange
    const num1 = 3;
    const num2 = 6;
    // Fazer alguma acao - Acttion
    const result = num1 * num2;
    // Conferir se essa acao foi a esperada - Assertion
    expect(result).toBe(18);
  });
});

// Cannot find module 'src/messages/entities/message' from 'person/entities/person.entity.ts'
// Necessario configurar no package para encontrar os caminhos.

// Sobre jest.fn e jest.spyOn
// https://chatgpt.com/share/67bdaccb-f944-800a-a3f9-00f8cb4dccae
