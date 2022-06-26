import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserRole } from '../user/entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginPayload } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(
    signUp: SignUpDto,
    profile: Express.Multer.File,
  ): Promise<User> {
    signUp.profileUrl = profile;
    const user = await this.userService.create(signUp);

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

    if (user.role === UserRole.doctor && !user.doctor.is_verified) {
      throw new ConflictException('User is not verified');
    }

    delete user.password;

    return user;
  }

  createToken(user: User) {
    return this.jwtService.sign({
      username: user.username,
      sub: user.email,
    });
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
