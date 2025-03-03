import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express';
import jwtConfig from "../config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { REQUEST_TOKEN_PAYLOAD_KEY } from "../auth.constants";

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    ) {}
  
  async canActivate(context: ExecutionContext):  Promise<boolean>  {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if(!token) {
      throw new UnauthorizedException("Nao autorizado");
    };
    
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {secret: this.jwtConfiguration.secret }
      );

      request[REQUEST_TOKEN_PAYLOAD_KEY] = payload;
    } catch (error) {
      throw new UnauthorizedException(error);
    }

    return true;
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}