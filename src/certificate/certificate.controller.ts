import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpStatus } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Certificate } from './entities/certificate.entity';
@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new Certificate' })
  @ApiResponse({ status: 201, description: 'Certificate created successfully', type: Certificate })
  @ApiResponse({ status: 500, description: 'Error in creating certificate' })
  create(@Request() req,@Body() createCertificateDto: CreateCertificateDto) {
    const id = req.user.user_metadata.sub;
    return this.certificateService.create(id, createCertificateDto);
  }

  @Get('/list')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Fetch all user certificates' })
  @ApiResponse({ status: 200, description: 'Certificate fetched successfully', type: Certificate })
  @ApiResponse({ status: 500, description: 'Error in fetching certificate' })
  findAll(@Request() req) {
    const id = req.user.user_metadata.sub;
    return this.certificateService.findAll(id);
  }

  @Get(':credentialId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Fetch certificate with certificate Id' })
  @ApiResponse({ status: 200, description: 'Certificate fetched successfully', type: Certificate })
  @ApiResponse({ status: 500, description: 'Error in fetching certificate' })
  findOne(@Param('credentialId') credentialId: string) {
    return this.certificateService.findOne(credentialId);
  }

  @Get('/public/:credentialId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Fetch certificate with certificate Id' })
  @ApiResponse({ status: 200, description: 'Certificate fetched successfully', type: Certificate })
  @ApiResponse({ status: 500, description: 'Error in fetching certificate' })
  findShared(@Param('credentialId') credentialId: string) {
    return this.certificateService.findPublicOne(credentialId);
  }

  @Post('/check-validitity/:credentialId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Fetch certificate with certificate Id' })
  @ApiResponse({ status: 200, description: 'Certificate fetched successfully', type: Certificate })
  @ApiResponse({ status: 500, description: 'Error in fetching certificate' })
  checkIsValid(@Param('credentialId') credentialId: string) {
    return this.certificateService.isCertificateAvailable(credentialId);
  }

  @Patch('/visibility/:credentialId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Toggle the visibility state of the certificate' })
  @ApiResponse({ status: 200, description: 'Certificate state switched successfully', type: Certificate })
  @ApiResponse({ status: 500, description: 'Error in swtitching certificate' })
  switchCertificateVisibility(@Param('credentialId') credentialId: string) {
    return this.certificateService.switchCertificateVisibility(credentialId);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update certificate details' })
  @ApiResponse({ status: 200, description: 'Certificate updated successfully', type: Certificate })
  @ApiResponse({ status: 500, description: 'Error in updating certificate' })
  update(@Request() req, @Body() updateCertificateDto: UpdateCertificateDto) {
    const id = req.user.user_metadata.sub;
    return this.certificateService.update(id, updateCertificateDto);
  }

  @Delete(':credentialId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete certificate' })
  @ApiResponse({ status: 200, description: 'Certificate deleted successfully', type: Certificate })
  @ApiResponse({ status: 500, description: 'Error in deleting certificate' })
  remove(@Param('credentialId') credentialId: string) {
    return this.certificateService.remove(credentialId);
  }
}
