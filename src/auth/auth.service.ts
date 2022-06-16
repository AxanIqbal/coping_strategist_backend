import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginPayload } from './dto/login.dto';

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

  async validateUser(login: LoginPayload): Promise<User> {
    const user = await this.userService.findOne(login.username);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    if (!(await user.checkPassword(login.password))) {
      throw new HttpException('Cred does not match', HttpStatus.BAD_REQUEST);
    }

    delete user.password;

    return user;
  }

  async createToken(user: User) {
    return {
      accessToken: this.jwtService.sign({ id: user.id }),
      user,
    };
  }

  signToken(user: User): string {
    const payload = {
      sub: user.email,
      username: user.username,
    };

    return this.jwtService.sign(payload, {
      secret: this.config.get<string>('SECRET'),
    });
  }
}
