import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginPayload } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() payload: LoginPayload,
  ): Promise<{ accessToken: string; user: User }> {
    const user = await this.authService.validateUser(payload);
    return this.authService.createToken(user);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() signUp: SignUpDto,
  ): Promise<{ accessToken: string; user: User }> {
    const user = await this.authService.register(signUp);
    return this.authService.createToken(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req): Promise<User> {
    return req.user;
  }
}
