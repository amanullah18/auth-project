import { PartialType } from '@nestjs/mapped-types';
import { BookCallDto } from './book-call.dto';

export class UpdateAppointmentDto extends PartialType(BookCallDto) {
  status?: string;
  googleMeetLink?: string;
} 