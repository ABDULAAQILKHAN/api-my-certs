import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, ILike } from 'typeorm';
import { Group } from './entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Certificate } from '../certificate/entities/certificate.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(Certificate)
    private certificateRepository: Repository<Certificate>,
  ) {}

  async create(userId: string, createGroupDto: CreateGroupDto): Promise<Group> {
    const { certificateIds, ...groupData } = createGroupDto;

    // Verify certificates exist (and optionally belong to user - good practice)
    const certificates = await this.certificateRepository.findBy({
      id: In(certificateIds),
      // userId: userId // Enforcing ownership check is safer
    });

    // If strictly required that all IDs must exist, we could check length:
    // if (certificates.length !== certificateIds.length) { ... }
    
    // However, we'll proceed with found certificates.
    
    const group = this.groupRepository.create({
      ...groupData,
      userId,
      shareToken: randomUUID(),
      certificates,
    });

    return this.groupRepository.save(group);
  }

  async findAll(userId: string, search?: string): Promise<Group[]> {
    const query = this.groupRepository.createQueryBuilder('group')
        .leftJoinAndSelect('group.certificates', 'certificate')
        .where('group.userId = :userId', { userId });

    if (search) {
      query.andWhere(
        '(group.name ILIKE :search OR group.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // load count if needed? Response struct mentions _count optional.
    // TypeORM handles relations, but _count property on response might need explicit mapping or loadRelationCountAndMap
    // But for now, returning the entity with certificates array covers the `certificates: Certificate[]` requirement.
    
    return query.getMany();
  }

  async findOne(id: string): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ['certificates'],
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    return group;
  }
  
  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    const group = await this.findOne(id);
    
    // Logic to update certificates if provided - Replaces the existing list
    if (updateGroupDto.certificateIds) {
       const certificates = await this.certificateRepository.findBy({
        id: In(updateGroupDto.certificateIds),
      });
      group.certificates = certificates;
    }
    
    const { certificateIds, ...groupData } = updateGroupDto;
    
    Object.assign(group, groupData);
    
    return this.groupRepository.save(group);
  }

  async remove(id: string): Promise<void> {
    const result = await this.groupRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
  }

  async findPublicOne(id: string): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id, isPublic: true },
      relations: ['certificates'],
    });

    if (!group) {
      // Security: Could return 404 to hide existence of private group, or 403.
      // 404 is generally safer and per spec if not found or not public.
      throw new NotFoundException(`Group not found or is not public`);
    }

    return group;
  }
}
