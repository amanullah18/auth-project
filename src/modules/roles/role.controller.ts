// src/roles/roles.controller.ts
import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from '../roles/entities/roles.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // Endpoint to create a role
  @Post()
  async createRole(@Body('name') name: string): Promise<Role> {
    return this.rolesService.createRole(name);
  }

  // Endpoint to get all roles
  @Get()
  async getAllRoles(): Promise<Role[]> {
    return this.rolesService.getAllRoles();
  }

  // Endpoint to assign permissions to roles
  @Post(':roleId/permissions')
  async assignPermissionToRole(
    @Param('roleId') roleId: number,
    @Body('permissionName') permissionName: string,
  ) {
    return this.rolesService.assignPermissionToRole(roleId, permissionName);
  }

  // Endpoint to get permissions for a specific role
  @Get(':roleId/permissions')
  async getPermissionsByRole(@Param('roleId') roleId: number) {
    return this.rolesService.getPermissionsByRole(roleId);
  }
}