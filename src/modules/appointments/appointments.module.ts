import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from './entities/appointment.entity';
import { SlotsModule } from '../slots/slots.module';
import { GoogleCalendarService } from '../../shared/services/google-calendar.service';
import { EmailModule } from '../../shared/services/email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), SlotsModule, EmailModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, GoogleCalendarService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {} 