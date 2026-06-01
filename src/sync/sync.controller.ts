import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { SyncService } from './sync.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('Sync')
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Sync user — creates on first call, updates metadata on subsequent calls' })
  @ApiResponse({ status: 201, description: 'User synced successfully', type: User })
  sync(@Request() req) {
    const { sub, email, metadata } = req.user;
    return this.syncService.sync({
      sub,
      email,
      name: metadata?.name,
      phone: metadata?.phone,
      isDark: metadata?.isDark,
    });
  }
}
