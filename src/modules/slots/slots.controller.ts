import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import {SlotsService } from './slots.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../roles/decorators/roles.decorator';
import { UserRole } from '../auth/common/constants/user-roles';

@Controller('api/v1/slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Get('available')
  async findAvailableByDate(@Query('date') date: string) {
    if (!date) {
      throw new Error('Date parameter is required');
    }
    return await this.slotsService.findAvailableByDate(date);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  
  async create(@Body() createSlotDto: CreateSlotDto) {
    return await this.slotsService.create(createSlotDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    return await this.slotsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id') id: string) {
    return await this.slotsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateSlotDto: UpdateSlotDto) {
    return await this.slotsService.update(id, updateSlotDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    return await this.slotsService.remove(id);
  }
} 