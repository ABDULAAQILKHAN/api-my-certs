import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuccessResponseDto } from '../dto/api-response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, SuccessResponseDto<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponseDto<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => {
        const message = this.getSuccessMessage(context, data);
        return new SuccessResponseDto(message, data, statusCode);
      }),
    );
  }

  private getSuccessMessage(context: ExecutionContext, data: any): string {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const controller = context.getClass().name;
    const handler = context.getHandler().name;

    // Default messages based on HTTP methods
    const defaultMessages = {
      POST: 'Resource created successfully',
      GET: 'Data retrieved successfully',
      PATCH: 'Resource updated successfully',
      PUT: 'Resource updated successfully',
      DELETE: 'Resource deleted successfully',
    };

    // You can customize messages based on controller and handler
    const customMessages = {
      ProfileController: {
        create: 'Profile created successfully',
        findOne: 'Profile retrieved successfully',
        update: 'Profile updated successfully',
        remove: 'Profile deleted successfully',
      },
    };

    if (customMessages[controller] && customMessages[controller][handler]) {
      return customMessages[controller][handler];
    }

    return defaultMessages[method] || 'Operation completed successfully';
  }
}
