import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import 'reflect-metadata';

import { User } from './users/users.entity';
import { Role } from './roles/roles.entity';
import { RolePermission } from './roles/role-permission.entity';

export const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as any, 
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/entity/*.ts'],
    migrations: [__dirname + '/migrations/*.ts'],
    synchronize: false,
    logging: true,
});  

// Initialize and run migrations when this file is executed directly

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
