import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { AuthUser } from '../user/decorator/user.decorator';
import { User } from '../user/entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { SessionAuthGuard } from './guards/session-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @UseInterceptors(TokenInterceptor)
  @HttpCode(HttpStatus.OK)
  async login(@AuthUser() user: User): Promise<User> {
    return user;
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(TokenInterceptor)
  register(@Body() signUp: SignUpDto): Promise<User> {
    return this.authService.register(signUp);
  }

  @UseGuards(SessionAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    console.log(req);
    return req.user;
  }
}
