import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { Certificate } from '../certificate/entities/certificate.entity';

@Injectable()
export class ProfileService {
  constructor(
  @InjectRepository(Profile)
  private profileRepository: Repository<Profile>,
  @InjectRepository(Certificate)
  private readonly certificateRepository: Repository<Certificate>,
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
    const certificates = await this.certificateRepository.findBy({ userId: id });
    const totalCertificates = certificates.length;
    (profile as any).totalCertificates = totalCertificates;
    const publicCertificates = certificates.filter(cert => cert.isPublic);
    const totalPublicCertificates = publicCertificates.length;
    (profile as any).totalPublicCertificates = totalPublicCertificates;
    const totalViews = publicCertificates.reduce((sum, cert) => sum + (cert.viewCount || 0), 0);
    (profile as any).totalViews = totalViews;
    return profile;
  }

  async update(id: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.findOne(id);
    
    // Create a copy of updateProfileDto and remove id and userId fields to prevent updates
    const { id: _, sub: __, email: ___ , ...updateData } = updateProfileDto as any;
    Object.assign(profile, updateData);
    return await this.profileRepository.save(profile);
  }

  async updateTheme(id: string) {
    const profile = await this.findOne(id);

    profile.isDark = !profile.isDark;
    return await this.profileRepository.save(profile);
  }

  async getTheme(id: string) {
    const profile = await this.findOne(id);
    return profile.isDark ?? false;
  }

  async remove(id: string) {
    const profile = await this.findOne(id);
    return await this.profileRepository.remove(profile);
  }
}
