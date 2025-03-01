import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';
import { PersonService } from './person.service';
import { Test, TestingModule } from '@nestjs/testing';
import { HasingServiceProtocol } from 'src/auth/hasing/hashing.protocol.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { BadRequestException, ConflictException } from '@nestjs/common';

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
        code: '23505'
      });

      await expect(personService.create({} as any)).rejects.toThrow(
        ConflictException
      );
    });

    it('should throw Exception for a generic error', async () => {
      jest.spyOn(personRepository, 'save').mockRejectedValue(
        new Error('Erro generico')
      );

      await expect(personRepository.save).rejects.toThrow(
        new  Error('Erro generico')
      );
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
