// src/roles/roles.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './roles.entity';
import { RolePermission } from './role-permission.entity';
import { RolesService } from './roles.service'; // The service handling business logic
import { RolesController } from './role.controller'; // The controller to handle API requests

@Module({
  imports: [TypeOrmModule.forFeature([Role, RolePermission])], // Importing entities for use in the module
  providers: [RolesService], // Inject the service
  controllers: [RolesController], // Register the controller to handle routes
})
export class RolesModule {}
