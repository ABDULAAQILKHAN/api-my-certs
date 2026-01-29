import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Group } from './entities/group.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('groups')
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new Group' })
  @ApiResponse({ status: 201, description: 'Group created successfully', type: Group })
  create(@Request() req, @Body() createGroupDto: CreateGroupDto) {
    const userId = req.user.user_metadata.sub;
    return this.groupService.create(userId, createGroupDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all groups' })
  @ApiQuery({ name: 'search', required: false, description: 'Filter by name or description' })
  @ApiResponse({ status: 200, description: 'Return all groups', type: [Group] })
  findAll(@Request() req, @Query('search') search?: string) {
    const userId = req.user.user_metadata.sub;
    return this.groupService.findAll(userId, search);
  }

  @Get('public/:id')
  @ApiOperation({ summary: 'Get public group details' })
  @ApiResponse({ status: 200, description: 'Return public group details', type: Group })
  findPublic(@Param('id') id: string) {
    return this.groupService.findPublicOne(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get group by id' })
  @ApiResponse({ status: 200, description: 'Return group details', type: Group })
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a group' })
  @ApiResponse({ status: 200, description: 'Group updated successfully', type: Group })
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a group' })
  @ApiResponse({ status: 200, description: 'Group deleted successfully' })
  remove(@Param('id') id: string) {
    return this.groupService.remove(id);
  }
}
