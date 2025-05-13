// src/datasource/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

// Entities
import { User } from '../modules/users/entities/users.entity';
import { Role } from '../modules/roles/entities/roles.entity';
import { RolePermission } from '../modules/roles/entities/role-permission.entity';

// Determine DB host based on environment
const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: isProduction ? process.env.DB_HOST || 'mysql-db' : 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'task1',
  entities: [User, Role, RolePermission],
  migrations: [__dirname + '/../migrations/*.ts'],
  synchronize: false,
  logging: true,
});

if (require.main === module) {
  AppDataSource.initialize()
    .then(async () => {
      console.log('✅ Data Source has been initialized!');
      await AppDataSource.runMigrations();
      console.log('🚀 Migrations have been run successfully!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Error during Data Source initialization or migration:', err);
      process.exit(1);
    });
}
