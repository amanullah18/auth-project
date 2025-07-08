import dotenv from 'dotenv';
dotenv.config();
import {User} from '../modules/users/entities/users.entity'
// import {TrainerSkillImage} from "/modules/trainer-skills/entities/trainer-skill-image.entity"
// import {TrainerSkill} from "src/modules/trainer-skills/entities/trainer-skill.entity"
// import {GalleryImage} from "src/modules/trainer-gallery/entities/trainer-gallery.entity"
// import {TrainerSocialLink} from "src/modules/trainer/entities/trainer-social-link.entity"
// import {Skill} from "src/modules/skills/entities/skill.entity"
import {Role} from "../modules/roles/entities/roles.entity"
import {RolePermission} from "../modules/roles/entities/role-permission.entity"
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User,Role,RolePermission], // ✅ correct glob path
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
}); 