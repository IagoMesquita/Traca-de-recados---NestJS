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
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authService: HasingServiceProtocol,
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    loginDto: LoginDto,
  ): Promise<{ message: string; accessToken: string, refreshToken: string }> {
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

    const accessToken = await this.singJwtAsync<Partial<Person>>(
      personDB.id,
      this.jwtConfiguration.jwtTtl,
      { email: personDB.email },
    );

    const refreshToken = await this.singJwtAsync(
      personDB.id,
      this.jwtConfiguration.jwtRefreshTtl,
    );

    return {
      message: 'Login Success!',
      accessToken,
      refreshToken
    };
  }

  private async singJwtAsync<T>(sub: number, expiresIn: number, payload?: T) {
    const payloadJwt = {
      sub,
      ...payload,
      // sub: personDB.id,
      // username: personDB.name,
      // email: personDB.email,
    };

    const config = {
      audience: this.jwtConfiguration.audience,
      issuer: this.jwtConfiguration.issuer,
      secret: this.jwtConfiguration.secret,
      expiresIn,
    };

    const accessToken = await this.jwtService.signAsync(payloadJwt, config);
    return accessToken;
  }

  refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return true;
  }
}
