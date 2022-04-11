import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserInput } from './dto/login-user.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = this.usersService.findOne(username);
    const valid = await bcrypt.compare(password, user?.password);

    if (user && valid) {
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

  async signup(loginUserInput: LoginUserInput) {
    const user = this.usersService.findOne(loginUserInput.username);

    if (user) {
      throw new Error('User already exists');
    }

    const password = await bcrypt.hash(loginUserInput.password, 10);

    return this.usersService.create({ ...loginUserInput, password });
  }
}
