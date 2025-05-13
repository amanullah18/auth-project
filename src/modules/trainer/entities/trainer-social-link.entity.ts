import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { User } from '../../users/entities/users.entity'; // adjust path as needed
  
  @Entity('trainer_social_links')
  export class TrainerSocialLink {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    platform: string;
  
    @Column()
    url: string;
  
    @ManyToOne(() => User, (user) => user.socialLinks, { onDelete: 'CASCADE' })
    trainer: User;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  