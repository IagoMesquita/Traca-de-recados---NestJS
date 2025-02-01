import { Module } from "@nestjs/common";
import { HasingServiceProtocol } from "./hasing/hashing.protocol.service";
import { BcryptService } from "./hasing/bcrypt.service";

@Module({
  providers: [
    {
      provide: HasingServiceProtocol,
      useClass: BcryptService
    }
  ],
})
export class AuthModule {}