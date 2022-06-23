import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('doctor')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class DoctorController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findOneDoctor(@Param('id') id: number) {
    return this.userService.findOneDoctor(id);
  }
}
