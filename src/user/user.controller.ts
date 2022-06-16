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

@Controller('user')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
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
    console.log(updateUserDto);
    console.log(user, 'the user');
    //   return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
