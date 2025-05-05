import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UpdateProfileDto } from 'src/profile/dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(data: Partial<User>) {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  findByEmail(email: string) {
    return this.repo.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'roleId', 'fullName'], // include all needed fields
    });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }
  async updateProfile(userId: number, dto: UpdateProfileDto, expectedRoleId: number) {
    const user = await this.findById(userId);
    if (!user || user.roleId !== expectedRoleId) {
      throw new Error(`Only role ${expectedRoleId} can access this endpoint.`);
    }
  
    Object.assign(user, dto);
    return this.repo.save(user);
  }
}

