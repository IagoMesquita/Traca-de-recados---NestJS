import { Global, Module } from '@nestjs/common';
import { HasingServiceProtocol } from './hasing/hashing.protocol.service';
import { BcryptService } from './hasing/bcrypt.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from 'src/person/entities/person.entity';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Person]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  exports: [
    HasingServiceProtocol,
    ConfigModule,
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HasingServiceProtocol,
      useClass: BcryptService,
    },
  ],
})
export class AuthModule {}
