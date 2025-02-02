import { Global, Module } from "@nestjs/common";
import { HasingServiceProtocol } from "./hasing/hashing.protocol.service";
import { BcryptService } from "./hasing/bcrypt.service";

@Global()
@Module({
  providers: [
    {
      provide: HasingServiceProtocol,
      useClass: BcryptService
    }
  ],
  exports: [HasingServiceProtocol]
})
export class AuthModule {}