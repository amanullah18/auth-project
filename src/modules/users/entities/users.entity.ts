// src/users/entities/users.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { GalleryImage } from '../../trainer-gallery/entities/trainer-gallery.entity'; // Adjust path as needed
import { TrainerSocialLink } from '../../trainer/entities/trainer-social-link.entity';
import { TrainerSkill } from '../../trainer-skills/entities/trainer-skill.entity'; // ✅ Adjust this path as needed


@Entity("User")
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
  roleId: number;
  
  @Column({ nullable: true })
  profilePhotoUrl?: string;

  @OneToMany(() => TrainerSocialLink, (link) => link.trainer, { cascade: true })
  socialLinks: TrainerSocialLink[];

  @OneToMany(() => GalleryImage, (galleryImage) => galleryImage.user)
  galleryImages: GalleryImage[]; // Relation to GalleryImage

  @OneToMany(() => TrainerSkill, (trainerSkill) => trainerSkill.trainer)
trainerSkills: TrainerSkill[];
}
