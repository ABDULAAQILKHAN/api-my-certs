import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
//modules
// import { ProfileModule } from './profile/profile.module';
import { CertificateModule } from './certificate/certificate.module';
import { GroupModule } from './group/group.module';
import { SyncModule } from './sync/sync.module';
//entities
// import { Profile } from './profile/entities/profile.entity';
import { Certificate } from './certificate/entities/certificate.entity';
import { Group } from './group/entities/group.entity';
import { User } from './sync/entities/user.entity';


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
        entities: [Certificate, Group, User],
        synchronize: true,
      }),
    }),
    // ProfileModule,
    CertificateModule,
    GroupModule,
    SyncModule,
  ],
})
export class AppModule {}
