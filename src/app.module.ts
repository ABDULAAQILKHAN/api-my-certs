import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
//modules
import { ProfileModule } from './profile/profile.module';
import { CertificateModule } from './certificate/certificate.module';
import { GroupModule } from './group/group.module';
//entities
import { Profile } from './profile/entities/profile.entity';
import { Certificate } from './certificate/entities/certificate.entity';
import { Group } from './group/entities/group.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes env available everywhere
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // make sure ConfigModule is available
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        ssl: true,
        entities: [Profile,Certificate,Group],
        synchronize: true,
      }),
    }),
    ProfileModule,
    CertificateModule,
    GroupModule,
  ],
})
export class AppModule {}
