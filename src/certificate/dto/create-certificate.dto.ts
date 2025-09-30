import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class CreateCertificateDto {
  @ApiProperty({ example: 'user123', description: 'User ID from authentication system' })
  @IsString()
  @IsOptional()
  @Length(3, 100)
  userId: string;

  @ApiProperty({ example: 'Amazon Certificate', description: 'Title of the certificate' })
  @IsString()
  @Length(3, 150)
  title: string;

  @ApiProperty({ example: 'This is my certificate description', description: 'Details about the certificate' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Amazon', description: 'Name of the certificate issuer' })
  @IsString()
  issuer: string;

  @ApiProperty({ example: 'Image', description: 'Certificate Image URL string' })
  @IsString()
  image: string;

  @ApiProperty({ example: 'Image', description: 'Certificate Image path' })
  @IsString()
  imagePath: string;


  @ApiProperty({ example: '2024-09-25T10:30:00Z', description: 'Date when the certificate was issued', required: false })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiProperty({ example: '2026-09-25T10:30:00Z', description: 'Date when the certificate expires', required: false })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiProperty({ example: 'AV2323CS', description: 'Unique credential ID', required: false })
  @IsOptional()
  @IsString()
  credentialId?: string;

  @ApiProperty({ example: true, description: 'Whether the certificate is public', required: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
