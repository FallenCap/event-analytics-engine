import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { ApiKey } from './api-key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ApiKey])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
