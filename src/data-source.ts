import { DataSource } from 'typeorm';
import 'reflect-metadata';

import { User } from './users/users.entity';
import { Role } from './roles/roles.entity.js';
import { RolePermission } from './roles/role-permission.entity';

export const AppDataSource = new DataSource({
  type: 'mysql', // or mysql, sqlite, etc.
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'task1',
  entities: [__dirname + '/entity/*.ts'],
  migrations: [__dirname + '/migrations/*.ts'], // 👈 IS THIS PRESENT?
  synchronize: false,
  logging: true,
});