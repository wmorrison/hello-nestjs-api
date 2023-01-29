import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}  
  
  async signup(dto: AuthDto) {
    // generate the password has
    const hash = await argon.hash(dto.password);

    try {
      // save the user in the db      
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash
        },
      });

      delete user.hash;

      // return the saved user
      return user;
  } catch(error) {
    if (error instanceof PrismaClientKnownRequestError) {
      const unique_contraint_failed = 'P2002';
      if (error.code === unique_contraint_failed) {
        throw new ForbiddenException('Credentials taken')
      }
    }
    throw error;
  }
  }

  signin() {
    return { msg: 'I have signed in'};
  }

}