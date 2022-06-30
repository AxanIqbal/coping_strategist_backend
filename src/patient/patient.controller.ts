import {
  Body,
  Controller,
  Delete,
  Get,
  MethodNotAllowedException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreateFileDto, CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../user/decorator/user.decorator';
import { User } from '../user/entities/user.entity';
import { Roles } from '../auth/decorator/user-roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('patient')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  @Roles('client')
  createFile(
    @Body() createFileDto: CreateFileDto,
    @UploadedFile() file: Express.Multer.File,
    @AuthUser() user: User,
  ) {
    return this.patientService.createFile(createFileDto, file, user);
  }

  @Get()
  findAll() {
    return this.patientService.findAll();
  }

  @Get('file')
  @Roles('client')
  getAllFiles(@AuthUser() user: User) {
    return this.patientService.getAllFiles(user);
  }

  @Get(':id')
  @Roles('doctor')
  findOne(@Param('id') id: string) {
    return this.patientService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientService.update(+id, updatePatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientService.remove(+id);
  }
}
