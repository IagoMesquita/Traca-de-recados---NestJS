import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TimingConnectionInterceptor implements NestInterceptor {
 intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();

    console.log('before');

    return next.handle().pipe(
      tap(() => {
        const elapsedTime = now - Date.now()

        console.log(`TimingConnectionInterceptor: levou ${elapsedTime}ms para executar.`)
      })
    );
  }
}
