import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;

  @ApiProperty()
  data?: T;

  @ApiProperty({ example: null })
  error?: string | null;

  @ApiProperty({ example: '2024-09-25T10:30:00Z' })
  timestamp: string;

  constructor(
    success: boolean,
    statusCode: number,
    message: string,
    data?: T,
    error?: string | null
  ) {
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }
}

export class SuccessResponseDto<T> extends ApiResponseDto<T> {
  constructor(message: string, data?: T, statusCode: number = 200) {
    super(true, statusCode, message, data, null);
  }
}

export class ErrorResponseDto extends ApiResponseDto<null> {
  constructor(message: string, error: string, statusCode: number = 400) {
    super(false, statusCode, message, null, error);
  }
}
