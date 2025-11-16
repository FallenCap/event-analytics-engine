import { HttpStatus } from '@nestjs/common';

export class ApiResponse {
  static success<T>(
    data: T,
    message = 'Success',
    statusCode: number = HttpStatus.OK,
  ) {
    return {
      success: true,
      message,
      statusCode,
      data,
    };
  }

  static created<T>(
    data: T,
    message = 'Resource created',
    statusCode: number = HttpStatus.CREATED,
  ) {
    return {
      success: true,
      message,
      statusCode,
      data,
    };
  }

  static error(
    message = 'Something went wrong',
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    errors?: any,
  ) {
    return {
      success: false,
      message,
      statusCode,
      errors,
    };
  }

  static badRequest(message = 'Bad request', errors?: any) {
    return this.error(message, HttpStatus.BAD_REQUEST, errors);
  }

  static unauthorized(message = 'Unauthorized') {
    return this.error(message, HttpStatus.UNAUTHORIZED);
  }

  static notFound(message = 'Not found') {
    return this.error(message, HttpStatus.NOT_FOUND);
  }

  static conflict(message = 'Conflict') {
    return this.error(message, HttpStatus.CONFLICT);
  }

  static forbidden(message = 'Forbidden') {
    return this.error(message, HttpStatus.FORBIDDEN);
  }

  static exceptionFailed(message = 'Exception failed', errors?: any) {
    return this.error(message, HttpStatus.EXPECTATION_FAILED, errors);
  }
}
