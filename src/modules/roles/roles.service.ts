// src/roles/roles.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../roles/entities/roles.entity';
import { RolePermission } from '../roles/entities/role-permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>, // Injecting the Role repository

    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>, // Injecting the RolePermission repository
  ) {}

  // Create a new role
  async createRole(name: string): Promise<Role> {
    const role = new Role();
    role.name = name;
    return await this.roleRepository.save(role); 
  }

  // Assign permission to a role
  async assignPermissionToRole(roleId: number, permissionName: string): Promise<RolePermission> {
    // Find the role by ID
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
  
    // Throw an error if the role is not found
    if (!role) {
      throw new Error(`Role with ID ${roleId} not found`);
    }
  
    // Create the RolePermission object
    const rolePermission = new RolePermission();
    rolePermission.role = role; // Role is guaranteed to be valid now
    rolePermission.permission_name = permissionName;
  
    // Save and return the role permission
    return await this.rolePermissionRepository.save(rolePermission);
  }
  

  // Fetch all roles
  async getAllRoles(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  // Fetch all permissions for a role
  async getPermissionsByRole(roleId: number): Promise<RolePermission[]> {
    return this.rolePermissionRepository.find({ where: { role: { id: roleId } } });
  }
}
