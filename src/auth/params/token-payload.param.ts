import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { REQUEST_TOKEN_PAYLOAD_KEY } from "../auth.constants";

export const TokenPayloadParam = createParamDecorator(
(data: any, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();
  console.log('tokenPayload', request[REQUEST_TOKEN_PAYLOAD_KEY]);
  return request[REQUEST_TOKEN_PAYLOAD_KEY];
}
);