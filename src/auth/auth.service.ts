import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = this.usersService.findOne(username);

    if (user && user.password === password) {
      const { password, ...result } = user;

      return result;
    }
    return null;
  }

  login(user: User) {
    return {
      user,
      accessToken: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
    };
  }
}
