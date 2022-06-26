import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User, UserRole } from '../user/entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginPayload } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { AuthUser } from '../user/decorator/user.decorator';
import { AuthGuard } from '@nestjs/passport';

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
  @UseInterceptors(FileInterceptor('profile'), TokenInterceptor)
  async register(
    @Body() signUp: SignUpDto,
    @UploadedFile() profile: Express.Multer.File,
  ): Promise<User> {
    return this.authService.register(signUp, profile);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req): Promise<User> {
    return req.user;
  }
}
