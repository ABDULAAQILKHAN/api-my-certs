import { CreateCertificateDto } from './dto/create-certificate.dto';
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from './entities/certificate.entity';
@Injectable()
export class CertificateService {
    constructor(
      @InjectRepository(Certificate)
      private certificateRepository: Repository<Certificate>,
    ) {}
  async create(id:string, createCertificateDto: CreateCertificateDto) {
    const found = await this.certificateRepository.findOneBy({ 
      credentialId: createCertificateDto.credentialId 
    });

    if (found) {
      throw new ConflictException('Certificate with  this credential Id already exists.');
    }

    const data = {
      ...createCertificateDto,
      userId: id,
    }
    const certificate = this.certificateRepository.create(data);
    return await this.certificateRepository.save(certificate);
  
  }

  findAll(id: string) {
    const certificates = this.certificateRepository.findBy({ userId: id });
    return certificates;
  }

  findOne(credentialId: string) {
    const certificate = this.certificateRepository.findOneBy({ credentialId });
    if (!certificate) {
      throw new NotFoundException(`Certificate with ID ${credentialId} not found`);
    }
    return certificate;
  }

  async findPublicOne(credentialId: string) {
    const certificate = await this.certificateRepository.findOneBy({ credentialId });
    if (!certificate || !certificate.isPublic) {
      throw new NotFoundException(`Certificate with ID ${credentialId} not found`);
    }
    return certificate;
  }

  async isCertificateAvailable(credentialId: string) {
    const certificate = await this.certificateRepository.findOneBy({ credentialId });
    if (!certificate) {
      return true
    }
    return false;
  }

  async update(id: string, updateCertificateDto: UpdateCertificateDto) {
    const found = await this.certificateRepository.findOneBy({ 
      credentialId: updateCertificateDto.credentialId 
    });

    if (!found) {
      throw new ConflictException('Certificate with this credential Id not found!');
    }
    const { userId: _, credentialId: ___ , ...updateData } = updateCertificateDto as any;
    Object.assign(found, updateData);
    return await this.certificateRepository.save(found);
  }

  async switchCertificateVisibility(credentialId: string) {
    const found = await this.certificateRepository.findOneBy({ 
      credentialId
    });

    if (!found) {
      throw new ConflictException('Certificate with this credential Id not found!');
    }

    Object.assign(found, { isPublic: !found.isPublic });
    return await this.certificateRepository.save(found);
  }


  async remove(credentialId: string) {
    const certificate = await this.certificateRepository.findOneBy({ credentialId});
    if (!certificate) {
      throw new NotFoundException(`Certificate with ID ${credentialId} not found`);
    }
    return await this.certificateRepository.remove(certificate);
  }
}
