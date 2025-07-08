import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slot } from './entities/slot.entity';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(Slot)
    private slotsRepository: Repository<Slot>,
  ) {}

  async create(createSlotDto: CreateSlotDto): Promise<Slot> {
    // Validate that end time is after start time
    if (createSlotDto.startTime >= createSlotDto.endTime) {
      throw new BadRequestException('End time must be after start time');
    }

    const slot = this.slotsRepository.create(createSlotDto);
    return await this.slotsRepository.save(slot);
  }

  async findAll(): Promise<Slot[]> {
    return await this.slotsRepository.find();
  }

  async findAvailableByDate(date: string): Promise<Slot[]> {
    return await this.slotsRepository.find({
      where: {
        date,
        isAvailable: true,
      },
      order: {
        startTime: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<Slot> {
    const slot = await this.slotsRepository.findOne({ where: { id } });
    if (!slot) {
      throw new NotFoundException(`Slot with ID ${id} not found`);
    }
    return slot;
  }

  async update(id: string, updateSlotDto: UpdateSlotDto): Promise<Slot> {
    const slot = await this.findOne(id);

    // Validate that end time is after start time if both are provided
    if (updateSlotDto.startTime && updateSlotDto.endTime) {
      if (updateSlotDto.startTime >= updateSlotDto.endTime) {
        throw new BadRequestException('End time must be after start time');
      }
    }

    Object.assign(slot, updateSlotDto);
    return await this.slotsRepository.save(slot);
  }

  async remove(id: string): Promise<void> {
    const slot = await this.findOne(id);
    await this.slotsRepository.remove(slot);
  }

  async markAsUnavailable(id: string): Promise<void> {
    const slot = await this.findOne(id);
    slot.isAvailable = false;
    await this.slotsRepository.save(slot);
  }

  async markAsAvailable(id: string): Promise<string> {
    const slot = await this.findOne(id);
    slot.isAvailable = true;
    await this.slotsRepository.save(slot);
    return `slot with ID ${id} has been deleted successfully`;
  }
} 