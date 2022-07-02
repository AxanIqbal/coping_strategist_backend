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
import { UserService } from '../user/user.service';
import { AuthUser } from '../user/decorator/user.decorator';
import { User } from '../user/entities/user.entity';
import { CreateFavDto } from '../user/dto/create-fav.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/user-roles.decorator';
import { PatientService } from './patient.service';

@Controller('favorites')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class FavoriteController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @Roles('client')
  addFav(@Body() favId: CreateFavDto, @AuthUser() user: User) {
    return this.patientService.addFav(user, favId);
  }

  @Delete()
  @Roles('client')
  deleteFav(@Body() favId: CreateFavDto, @AuthUser() user: User) {
    return this.patientService.removeFav(user, favId);
  }

  @Get()
  @Roles('client')
  getAllFav(@AuthUser() user: User) {
    return this.patientService.getAllFav(user);
  }
}
