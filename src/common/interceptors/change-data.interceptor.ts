import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Console } from "console";
import { Observable, map } from "rxjs";

@Injectable()
export class ChangeDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    console.log("intercept change")

    return next.handle().pipe(
      map((data) => {
        console.log("DATA", data)
        if(Array.isArray(data.data)) {
          return {
            totalElemenstInPage: data.data.length,
            ...data
          }
        }

        return data;
      })
    );
  }
}