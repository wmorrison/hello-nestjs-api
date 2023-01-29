import { AuthGuard } from "@nestjs/passport";

export class JwtGuard extends AuthGuard('custom-jwt') {
  constructor() {
    super();
  }
}