import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';
import { PersonService } from './person.service';
import { Test, TestingModule } from '@nestjs/testing';
import { HasingServiceProtocol } from 'src/auth/hasing/hashing.protocol.service';
import { getRepositoryToken } from '@nestjs/typeorm';

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
          useValue: {} 
        },
        {
          provide: HasingServiceProtocol,
          useValue: {},
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
    it('must create a new person', () => {
      // CreatePersonDto
      // Que o hashin service tenha o metodo hash
      // Saber se o hashing service foi chamado com CreatePersonDto
      // Saber se o pesersonRepository.create foi chamado com dados person
      // Sabser se personRepository.save foi chamado com a person criada
      // O retorno final deve ser a nova person criada -> expect
    });
  })
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
