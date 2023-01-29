import { createParamDecorator } from "@nestjs/common/decorators";
import { ExecutionContext } from "@nestjs/common/interfaces";

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);