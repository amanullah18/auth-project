import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { TrainerSkillsService } from './trainer-skills.service';
import { CreateTrainerSkillDto } from './dto/create-trainer-skill.dto';
import { UpdateTrainerSkillDto } from './dto/update-trainer-skill.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/roles/decorators/roles.decorator';
import { UserRole } from 'src/modules/auth/common/constants/user-roles';

@Controller('trainer/skills')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.TRAINER)
export class TrainerSkillsController {
  constructor(private readonly trainerSkillsService: TrainerSkillsService) {}

  // Create a skill with optional images
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Request() req,
    @Body() createDto: CreateTrainerSkillDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    const trainer = req.user;
    return this.trainerSkillsService.create(trainer, createDto, files || []);
  }

  // Get all skills for all trainers (can restrict later)
  @Get()
  async findAll() {
    return this.trainerSkillsService.findAll();
  }

  // Get a specific skill
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.trainerSkillsService.findOne(id);
  }

  // Update a trainer skill (trainer must own it)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateDto: UpdateTrainerSkillDto
  ) {
    return this.trainerSkillsService.update(id, req.user, updateDto);
  }

  // Delete a skill and associated images
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.trainerSkillsService.delete(id, req.user);
  }
}
 