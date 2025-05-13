import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TrainerSkillsService } from './trainer-skills.service';
import { CreateTrainerSkillDto } from './dto/create-trainer-skill.dto';
import { UpdateTrainerSkillDto } from './dto/update-trainer-skill.dto';

@Controller('trainer/:trainer_id/skills')
export class TrainerSkillsController {
  constructor(private readonly trainerSkillsService: TrainerSkillsService) {}

  @Post(':skill_id')
  createTrainerSkill(
    @Param('trainer_id', new ParseUUIDPipe()) trainer_id: string,
    @Param('skill_id', new ParseUUIDPipe()) skill_id: string,
    @Body() dto: CreateTrainerSkillDto,
  ) {
    return this.trainerSkillsService.createTrainerSkill(trainer_id, skill_id, dto);
  }

  @Put(':skill_id')
  updateTrainerSkill(
    @Param('trainer_id', new ParseUUIDPipe()) trainer_id: string,
    @Param('skill_id', new ParseUUIDPipe()) skill_id: string,
    @Body() dto: UpdateTrainerSkillDto,
  ) {
    return this.trainerSkillsService.updateTrainerSkill(trainer_id, skill_id, dto);
  }

  @Get()
  getTrainerSkills(@Param('trainer_id', new ParseUUIDPipe()) trainer_id: string) {
    return this.trainerSkillsService.getTrainerSkills(trainer_id);
  }

  @Delete(':skill_id')
  deleteTrainerSkill(
    @Param('trainer_id', new ParseUUIDPipe()) trainer_id: string,
    @Param('skill_id', new ParseUUIDPipe()) skill_id: string,
  ) {
    return this.trainerSkillsService.deleteTrainerSkill(trainer_id, skill_id);
  }

  @Post(':skill_id/images')
  addTrainerSkillImages(
    @Param('trainer_id', new ParseUUIDPipe()) trainer_id: string,
    @Param('skill_id', new ParseUUIDPipe()) skill_id: string,
    @Body('files') files: string[],
  ) {
    return this.trainerSkillsService.addTrainerSkillImages(trainer_id, skill_id, files);
  }
}
