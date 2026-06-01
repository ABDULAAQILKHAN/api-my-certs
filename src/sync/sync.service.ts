import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByUserId(userId: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ userId });
    if (!user) {
      throw new NotFoundException('User not found. Please call POST /sync first.');
    }
    return user;
  }

  async sync(payload: { sub: string; email: string; name?: string; phone?: string; isDark?: boolean }): Promise<User> {
    let user = await this.userRepository.findOneBy({ userId: payload.sub });

    if (!user) {
      const newUser = new User();
      newUser.userId = payload.sub;
      newUser.email = payload.email;
      newUser.name = payload.name ?? null;
      newUser.phone = payload.phone ?? null;
      newUser.isDark = payload.isDark ?? false;
      user = newUser;
    } else {
      if (payload.name !== undefined) user.name = payload.name;
      if (payload.phone !== undefined) user.phone = payload.phone;
      if (payload.isDark !== undefined) user.isDark = payload.isDark;
    }

    return this.userRepository.save(user);
  }
}
