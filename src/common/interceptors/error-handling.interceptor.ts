import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, throwError } from 'rxjs';
export class ErrorHandlingInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    console.log('ErrorHandlingInterceptor executado ANTES');
    // await new Promise(resolve => setTimeout(resolve, 10000));
    return next.handle().pipe(
      catchError(error => {
        return throwError(() => {
          if (error.name === 'NotFoundException') {
            return new BadRequestException(error.message);
          }
          return new BadRequestException('Ocorreu um erro desconhecido.');
        });
      }),
    );
  }
}

// Esse exemplo ano foi muito bom. Ele pega uma excpetion NotFoud e altera para Bad Request.
// Tlvz seja interessante em uma situacao onde minha api se conecta a outra api, e para as
// exceptions que essa api gera, eu altere para um contexto do meu projeto/organizacao