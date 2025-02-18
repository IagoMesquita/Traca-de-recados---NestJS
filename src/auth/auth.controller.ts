import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/loogin.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {};

  @Post()
  login(@Body() loginDto: LoginDto  ) {
    return this.authService.signIn(loginDto)
  }

  @Post("/refresh")
  refresgTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

}