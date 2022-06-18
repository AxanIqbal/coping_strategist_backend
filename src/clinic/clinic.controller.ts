import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Optional,
  Param,
  ParseFloatPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { CreateAppointmentDto, CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ClinicAppointments } from './entities/clinic.appointments.entity';
import { AuthUser } from '../user/decorator/user.decorator';
import { User } from '../user/entities/user.entity';

@Controller('clinic')
@UseGuards(JwtAuthGuard)
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Post()
  create(@Body() createClinicDto: CreateClinicDto) {
    createClinicDto.location = {
      type: 'Point',
      coordinates: [createClinicDto.longitude, createClinicDto.latitude],
    };
    return this.clinicService.create(createClinicDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('appointment')
  createAppointment(
    @Body() createAppointment: CreateAppointmentDto,
    @AuthUser() user: User,
  ) {
    return this.clinicService.createAppointment(createAppointment, user);
  }

  @Get()
  findAll(
    @Query('latitude') latitude?: number,
    @Query('longitude') longitude?: number,
    @Query('radius') radius = 50,
    @Query('search') search?: string,
  ) {
    return this.clinicService.findAll(radius, search, latitude, longitude);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clinicService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClinicDto: UpdateClinicDto) {
    return this.clinicService.update(+id, updateClinicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clinicService.remove(+id);
  }
}
