import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { TrainerSkill } from './trainer-skill.entity';

@Entity('trainer_skill_images')
export class TrainerSkillImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TrainerSkill, (skill) => skill.images, { onDelete: 'CASCADE' })
  trainerSkill: TrainerSkill;

  @Column()
  image_url: string;

  @CreateDateColumn()
  created_at: Date;
}
