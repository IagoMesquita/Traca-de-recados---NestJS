import { Global, Module } from '@nestjs/common';
import { HasingServiceProtocol } from './hasing/hashing.protocol.service';
import { BcryptService } from './hasing/bcrypt.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from 'src/person/entities/person.entity';

@Global()
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HasingServiceProtocol,
      useClass: BcryptService,
    },
  ],
  imports: [TypeOrmModule.forFeature([Person])],
  exports: [HasingServiceProtocol],
})
export class AuthModule {}
