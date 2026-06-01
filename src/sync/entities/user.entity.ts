import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({ example: 'uuid-string', description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'auth0|user123', description: 'User ID from authentication system' })
  @Column({ unique: true })
  userId: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address' })
  @Column()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @Column({ type: 'varchar', nullable: true })
  name: string | null;

  @ApiProperty({ example: '+91 8989680289', description: 'Phone number' })
  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @ApiProperty({ example: false, description: 'Dark mode preference' })
  @Column({ nullable: true, default: false })
  isDark: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
