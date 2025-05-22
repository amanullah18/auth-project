import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './roles.entity';

@Entity('roles_has_permissions')
export class RolePermission {
  // UUID as primary key for flexibility
  @PrimaryGeneratedColumn('uuid')
  id: string;
 
  // Foreign key to Role entity
  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  // Permission name (e.g., UPLOAD_PROFILE_PHOTO)
  @Column()
  permission_name: string;
}