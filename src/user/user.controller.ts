import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
  Patch,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthUser } from './decorator/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/user-roles.decorator';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('merchants')
  @Roles('admin')
  getAllMerchants() {
    return this.userService.getAllMerchants();
  }

  @Get('me')
  getAllMyData(@AuthUser() user: User) {
    return user;
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto, @AuthUser() user: User) {
    return this.userService.update(updateUserDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
