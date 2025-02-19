import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoutePolicies } from '../enums/route-policies.enum';
import { ROUTE_POLICY_KEY } from '../auth.constants';

@Injectable()
export class RoutePolicyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const routePolicyrequired = this.reflector.get<RoutePolicies | undefined>(
      ROUTE_POLICY_KEY,
      context.getHandler(),
    );
    console.log(
      routePolicyrequired
    );
    return true;
  }
}
