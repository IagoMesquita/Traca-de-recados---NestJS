import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class RoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const resquest = context.switchToHttp().getRequest();
    const role = resquest['user']?.role;

    console.log("Passou pelo RoleGuard", resquest['user'])
    return role === 'admin' ? true : false;
  }
}