// src/trainer-gallery/entities/gallery-image.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/users.entity';

@Entity('gallery_images')
export class GalleryImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  fileUrl: string;

  @Column({ nullable: true })
  caption: string;

    @Column({ nullable: true })
  sortOrder: number;

  @CreateDateColumn() // Automatically set the timestamp when created
  uploadTimestamp: Date;

  @ManyToOne(() => User, (user) => user.galleryImages)
  @JoinColumn({ name: 'user_id' }) // Set up the foreign key
  user: User;
}
