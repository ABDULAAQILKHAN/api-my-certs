import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from './entities/certificate.entity';
import { SyncModule } from '../sync/sync.module';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate]), SyncModule],
  controllers: [CertificateController],
  providers: [CertificateService],
})
export class CertificateModule {}
