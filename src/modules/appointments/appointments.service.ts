import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { BookCallDto } from './dto/book-call.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { SlotsService } from '../slots/slots.service';
import { GoogleCalendarService } from '../../shared/services/google-calendar.service';
import { EmailService } from '../../shared/services/email/email.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    private slotsService: SlotsService,
    private googleCalendarService: GoogleCalendarService,
    private emailService: EmailService,
  ) { }



  async bookCall(bookCallDto: BookCallDto): Promise<{
    appointment: Appointment;
    emailStatus: { success: boolean; message: string };
  }> {
    // Check if slot exists and is available
    const slot = await this.slotsService.findOne(bookCallDto.slotId);

    if (!slot.isAvailable) {
      throw new BadRequestException('Slot is not available');
    }

    // Check if slot is already booked
    const existingAppointment = await this.appointmentsRepository.findOne({
      where: { slotId: bookCallDto.slotId },
    });

    if (existingAppointment) {
      throw new BadRequestException('Slot is already booked');
    }

    // Generate Google Meet link
    const googleMeetLink = await this.googleCalendarService.createMeeting(
      slot,
      bookCallDto.email,
      bookCallDto.name
    );

    // Create appointment
    const appointment = this.appointmentsRepository.create({
      ...bookCallDto,
      status: 'BOOKED',
      googleMeetLink,
    });

    const savedAppointment = await this.appointmentsRepository.save(appointment);

    // Mark slot as unavailable
    await this.slotsService.markAsUnavailable(bookCallDto.slotId);

    // Send booking confirmation email
    const emailStatus= await this.emailService.sendBookingConfirmation(
      bookCallDto.email,
      bookCallDto.name,
      googleMeetLink,
      slot
    );

    return {
      appointment: savedAppointment,
      emailStatus
    };

  }

  async findAll(filters?: { date?: string; status?: string }): Promise<Appointment[]> {
    const query = this.appointmentsRepository.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.slot', 'slot');

    if (filters?.date) {
      query.andWhere('slot.date = :date', { date: filters.date });
    }

    if (filters?.status) {
      query.andWhere('appointment.status = :status', { status: filters.status });
    }

    return await query.orderBy('appointment.createdAt', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['slot'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);
    Object.assign(appointment, updateAppointmentDto);
    return await this.appointmentsRepository.save(appointment);
  }

  async cancel(id: string): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = 'CANCELLED';

    // Mark slot as available again
    await this.slotsService.markAsAvailable(appointment.slotId);

    return await this.appointmentsRepository.save(appointment);
  }

  async remove(id: string): Promise<string> {
    const appointment = await this.findOne(id);
    await this.appointmentsRepository.remove(appointment);
    return `Appointment with ID ${id} has been deleted successfully`;
  }


} 