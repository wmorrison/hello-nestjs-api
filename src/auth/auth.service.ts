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

  async signin(dto: AuthDto) {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      }
    });
    // if user does not exist, throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');

    // compare passwords
    const pwMatches = await argon.verify(user.hash, dto.password);

    // if password incorrect, throw an exception
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
    
    // return user
    delete user.hash;
    return user;
    return { msg: 'I have signed in'};
  }

}