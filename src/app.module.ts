// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import {User} from "./modules/users/entities/users.entity"

import {Role} from "./modules/roles/entities/roles.entity"
import {RolePermission} from "./modules/roles/entities/role-permission.entity"
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { SlotsModule } from './modules/slots/slots.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { Slot } from './modules/slots/entities/slot.entity';
import { Appointment } from './modules/appointments/entities/appointment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true ,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User,Role,RolePermission,Slot,Appointment],
        synchronize: false,
      }),
    }),

    // Other feature modules
    AuthModule,
    UsersModule,
    RolesModule,
    SlotsModule,
    AppointmentsModule
  ],
})
export class AppModule { }