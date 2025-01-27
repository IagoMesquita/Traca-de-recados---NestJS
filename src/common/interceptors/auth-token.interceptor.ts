import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthTokenInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    let token: string = req.headers.authorization?.split(' ')[1];

    if (!token || token !== '010203') {
      throw new UnauthorizedException('Usuario nao autenticado');
    }

    return next.handle();
  }
}

//Nesse exemplo, poderiamos ter usado o Guardians tbm
