import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/loogin.dto';
import { HasingServiceProtocol } from './hasing/hashing.protocol.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from 'src/person/entities/person.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly authService: HasingServiceProtocol,
  ) {}

  async signIn(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    const personDB = await this.personRepository.findOne({ where: { email }});

    if (!personDB) {
      throw new NotFoundException(`Pessoa nao encontrada para o email: ${email}`);
    }

    const isMatch = await this.authService.compare(password, personDB.passwordHash);
    
    if (!isMatch) {
      throw new UnauthorizedException('Usuario nao autorizado')
    }

  

    return {
      loginDto,
      message: "usuario logado!"
    };
  }
}
