import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('slots')
export class Slot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string; // YYYY-MM-DD

  @Column()
  startTime: string; // HH:MM

  @Column()
  endTime: string; // HH:MM

  @Column({ default: true })
  isAvailable: boolean;
} 