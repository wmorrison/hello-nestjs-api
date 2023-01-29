import { Controller } from '@nestjs/common';
import { Get, Patch, Req, UseGuards } from '@nestjs/common/decorators';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  updateUser() {
    
  }
}