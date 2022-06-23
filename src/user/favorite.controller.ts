import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { AuthUser } from './decorator/user.decorator';
import { User } from './entities/user.entity';
import { CreateFavDto } from './dto/create-fav.dto';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class FavoriteController {
  constructor(private readonly userService: UserService) {}

  @Post()
  addFav(@Body() favId: CreateFavDto, @AuthUser() user: User) {
    return this.userService.addFav(user, favId);
  }

  @Delete()
  deleteFav(@Body() favId: CreateFavDto, @AuthUser() user: User) {
    return this.userService.removeFav(user, favId);
  }
}
