import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(signUp: SignUpDto): Promise<User> {
    const user = await this.userService.create(signUp);
    if (user instanceof HttpException) {
      throw user;
    }

    delete user.password;

    return user;
  }

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOne(username);
    if (user && (await user.checkPassword(password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  signToken(user: User): string {
    const payload = {
      sub: user.email,
    };

    return this.jwtService.sign(payload, {
      secret: this.config.get<string>('SECRET'),
    });
  }
}
