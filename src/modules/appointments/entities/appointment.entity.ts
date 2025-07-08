import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Slot } from '../../slots/entities/slot.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  slotId: string;

  @ManyToOne(() => Slot)
  @JoinColumn({ name: 'slotId' })
  slot: Slot;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  status: string; // BOOKED, CANCELLED

  @Column()
  googleMeetLink: string;

  @CreateDateColumn()
  createdAt: Date;
} 