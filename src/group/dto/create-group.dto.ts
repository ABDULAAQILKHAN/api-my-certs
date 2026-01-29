import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsArray, IsUUID } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ example: 'My Group', description: 'Name of the group' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Description', description: 'Description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: ['uuid-1', 'uuid-2'], description: 'Array of certificate UUIDs' })
  @IsArray()
  @IsUUID('4', { each: true })
  certificateIds: string[];

  @ApiProperty({ example: true, description: 'Is public' })
  @IsBoolean()
  isPublic: boolean;
}
