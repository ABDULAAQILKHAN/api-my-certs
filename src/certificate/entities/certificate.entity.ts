
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('certificates')
export class Certificate {
  @ApiProperty({ example: 'uuid-string', description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'user123', description: 'User ID from authentication system' })
  @Column({ unique: false })
  userId: string;

  @ApiProperty({ example: 'Amazon certificate', description: 'Title of certificate' })
  @Column()
  title: string;

  @ApiProperty({ example: 'This is my certificates description', description: '' })
  @Column({ unique: false })  
  description: string;

  @ApiProperty({ example: 'Amazon', description: 'Name of the certificate issuer.' })
  @Column({ unique: false })  
  issuer: string;

  @ApiProperty({ example: 'Image', description: 'Image URL of the certificate issued.' })
  @Column({ unique: false, nullable: true })  
  image: string;

  @ApiProperty({ example: 'Image', description: 'Image path of the certificate issued.' })
  @Column({ unique: true, nullable: true })  
  imagePath: string;

  @ApiProperty({ example: '2024-09-25T10:30:00Z', description: 'Date of certificate issue.', required: false })
  @Column({ nullable: true })
  issueDate: string;

  @ApiProperty({ example: '2024-09-25T10:30:00Z', description: 'Date of certificate expiration.', required: false })
  @Column({ nullable: true })
  expiryDate: string;

  @ApiProperty({ example: 'AV2323CS', description: 'unique certificate ID.', required: false })
  @Column({ nullable: false, unique: true })
  credentialId: string;

  @ApiProperty({ example: 'false', description: 'Bool to check if certificate is public or private.', required: false })
  @Column({ nullable: true })
  isPublic: boolean;


  @ApiProperty({ example: '2024-09-25T10:30:00Z', description: 'Profile creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2024-09-25T12:45:00Z', description: 'Profile last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;
}