import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Certificate } from '../../certificate/entities/certificate.entity';

@Entity('groups')
export class Group {
  @ApiProperty({ example: 'uuid-string', description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'My Java Certs', description: 'Name of the group' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Collection of Java certificates', description: 'Description of the group' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ example: true, description: 'Whether the group is public' })
  @Column({ default: false })
  isPublic: boolean;

  @ApiProperty({ example: 'token-string', description: 'Unique token for public sharing' })
  @Column({ unique: true })
  shareToken: string;

  @ApiProperty({ example: 'user123', description: 'User ID' })
  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: () => [Certificate] })
  @ManyToMany(() => Certificate)
  @JoinTable()
  certificates: Certificate[];
}
