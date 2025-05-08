import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TrainerSocialLink } from 'src/trainer/trainer-social-link.entity'
import { OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  role_id: number;
  
  @Column({ nullable: true })
  profilePhotoUrl?: string;

  @OneToMany(() => TrainerSocialLink, (link) => link.trainer, { cascade: true })
  socialLinks: TrainerSocialLink[];

}