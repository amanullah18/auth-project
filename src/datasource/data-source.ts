import dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/modules/**/entities/*.ts'], // ✅ correct glob path
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
