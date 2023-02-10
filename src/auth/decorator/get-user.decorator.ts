import { createParamDecorator } from "@nestjs/common/decorators";
import { ExecutionContext } from "@nestjs/common/interfaces";

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);