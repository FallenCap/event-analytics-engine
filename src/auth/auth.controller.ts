import {
  Body,
  Controller,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ApiResponse } from '../helper/api.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    try {
      const result = await this.authService.register(body.email);

      return ApiResponse.created(result, 'User Registered Successfully!');
    } catch (error) {
      if (error instanceof HttpException)
        return ApiResponse.badRequest(error.message);

      return ApiResponse.exceptionFailed();
    }
  }

  @Get('api-key/:email')
  async getKey(@Param('email') email: string) {
    try {
      const result = await this.authService.getApikey(email);

      return ApiResponse.success(result, 'API Key');
    } catch (error) {
      if (error instanceof HttpException) {
        return ApiResponse.badRequest(error.message);
      } else if (error instanceof NotFoundException) {
        return ApiResponse.notFound(error.message);
      } else {
        return ApiResponse.exceptionFailed();
      }
    }
  }
}
