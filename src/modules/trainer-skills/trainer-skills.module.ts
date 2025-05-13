import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainerSkillsController } from './trainer-skills.controller';
import { TrainerSkillsService } from './trainer-skills.service';
import { TrainerSkill } from '../trainer-skills/entities/trainer-skill.entity';
import { TrainerSkillImage } from '../trainer-skills/entities/trainer-skill-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrainerSkill, TrainerSkillImage]),
  ],
  controllers: [TrainerSkillsController],
  providers: [TrainerSkillsService],
  exports: [TrainerSkillsService],
})
export class TrainerSkillsModule {}
