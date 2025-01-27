import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';

@Injectable()
export class SimpleCacheInteceptor implements NestInterceptor {
  private readonly cache = new Map();

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log('SimpleCacheInterceptor executado ANTES');
    const request = context.switchToHttp().getRequest();
    const url = request.url;

    if (this.cache.has(url)) {
      console.log('Esta no cash', url);
      return of(this.cache.get(url)); // of pois e um Observable
    }

    return next.handle().pipe(
      tap((data) => {
        console.log('data', data);
        this.cache.set(url, data);
        console.log('Armazenando em cache', url);
      }),
    );
  }
}
