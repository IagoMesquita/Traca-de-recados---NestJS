import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/loogin.dto';
import { HasingServiceProtocol } from './hasing/hashing.protocol.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from 'src/person/entities/person.entity';
import { Repository } from 'typeorm';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly authService: HasingServiceProtocol,
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {
    console.log(jwtConfiguration);
  }

  async signIn(loginDto: LoginDto): Promise<{message: string, access_token: string }> {
    const { email, password } = loginDto;

    const personDB = await this.personRepository.findOne({ where: { email } });

    if (!personDB) {
      throw new NotFoundException(
        `Pessoa nao encontrada para o email: ${email}`,
      );
    }

    const isMatch = await this.authService.compare(
      password,
      personDB.passwordHash,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Usuario nao autorizado');
    }

    const payload = {
      sub: personDB.id,
      username: personDB.name,
      email: personDB.email,
    };

    const config = {
      audience: this.jwtConfiguration.audience,
      issuer: this.jwtConfiguration.issuer,
      secret: this.jwtConfiguration.secret,
      expiresIn: this.jwtConfiguration.jwtTtl,
    }; 

    return {
      message: 'Login Success!',
      access_token: await this.jwtService.signAsync(payload, config),
    };
  }
}
