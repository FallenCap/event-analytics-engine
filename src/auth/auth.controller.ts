import {
  Body,
  Controller,
  HttpException,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ApiResponse } from '../helper/api.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
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
}
