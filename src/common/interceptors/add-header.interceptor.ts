import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AddHeaderInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log('AddHeaderInterceptor executado.');
  
    const response = context.switchToHttp().getResponse();

    response.setHeader('X-Custom-Header', 'O valor do header')
    response.setHeader('X-userId', 'IdDummy-fsjbe4sg61ac6faf46a')
   
    return next.handle()
    
  }
}
