import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    // Check if profile already exists
    const found = await this.profileRepository.findOneBy({ 
      userId: createProfileDto.sub 
    });
    
    if (found) {
      throw new ConflictException('Profile already exists for this user');
    }

    const user = {
      userId: createProfileDto.sub,
      name: createProfileDto.name,
      email: createProfileDto.email,
      phone: createProfileDto.phone,
    };

    const result = this.profileRepository.create(user);
    return await this.profileRepository.save(result);
  }

  async findAll() {
    return await this.profileRepository.find();
  }

  async findOne(id: string) {
    const profile = await this.profileRepository.findOneBy({ userId: id });
    
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    
    return profile;
  }

  async update(id: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.findOne(id);
    
    // Create a copy of updateProfileDto and remove id and userId fields to prevent updates
    const { id: _, sub: __, email: ___ , ...updateData } = updateProfileDto as any;
    console.log('Update data:', updateData);
    Object.assign(profile, updateData);
    return await this.profileRepository.save(profile);
  }

  async remove(id: string) {
    const profile = await this.findOne(id);
    return await this.profileRepository.remove(profile);
  }
}
