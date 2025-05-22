// src/entities/trainer-skill.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/users.entity'; // adjust the path as needed
import { Skill } from '../../skills/entities/skill.entity';
import { TrainerSkillImage } from '../entities/trainer-skill-image.entity';

@Entity('trainer_skills')
export class TrainerSkill {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.trainerSkills, { eager: true })
  trainer: User;

  @ManyToOne(() => Skill, { eager: true })
  skill: Skill;

  @Column('text')
  experience_desc: string;

  @Column('int')
  years_of_experience: number;

  @OneToMany(() => TrainerSkillImage, (img) => img.trainerSkill, { cascade: true })
  images: TrainerSkillImage[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
