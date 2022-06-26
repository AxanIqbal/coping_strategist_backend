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

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
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
  @UseInterceptors(FileInterceptor('profile'))
  async register(
    @Body() signUp: SignUpDto,
    @UploadedFile() profile: Express.Multer.File,
  ): Promise<{ accessToken: string; user: User }> {
    console.log(signUp);
    const user = await this.authService.register(signUp, profile);
    return this.authService.createToken(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req): Promise<User> {
    return req.user;
  }
}
