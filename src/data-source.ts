import { DataSource } from 'typeorm';
import { User } from './users/users.entity'; // ✅ No .ts or .js

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'task1',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});
