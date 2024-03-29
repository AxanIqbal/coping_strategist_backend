import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DoctorService } from './doctor.service';
import { Doctor } from './entities/doctor.entity';
import { AuthUser } from '../user/decorator/user.decorator';
import { User } from '../user/entities/user.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/user-roles.decorator';
import { VerifyDto } from './dto/verify.dto';

@Controller('doctor')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  getAll(@Query('search') search?: string): Promise<Doctor[]> {
    return this.doctorService.getAll(search);
  }

  @Get('unverified')
  @Roles('admin')
  getAllUnverified() {
    return this.doctorService.getAllUnverified();
  }

  @Post('verify')
  @Roles('admin')
  verifyDoctor(@Body() id: VerifyDto) {
    return this.doctorService.verifyDoctor(id);
  }

  @Get('subscribed')
  @Roles('doctor')
  getAllSubscribed(@AuthUser() user: User) {
    return this.doctorService.getAllSubscribed(user);
  }

  @Get(':id')
  async findOneDoctor(@Param('id') id: number, @AuthUser() user: User) {
    return this.doctorService.findOneDoctor(id, user);
  }
}
