import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('roles')
export class Role {
  // Primary key auto-generated integer ID
  @PrimaryGeneratedColumn()
  id: number;

  // Role name must be unique (Admin, Client, Trainer)
  @Column({ unique: true })
  name: string;
}