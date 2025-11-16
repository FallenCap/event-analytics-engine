import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { User } from './users.entity';
import { ApiKey } from '../api-key/api-key.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private user: Repository<User>,
    @InjectRepository(ApiKey) private apiKey: Repository<ApiKey>,
  ) {}

  /**
   * * generate API key
   * @returns {String}
   */
  private generateApiKey(): string {
    return randomBytes(8).toString('hex');
  }

  async register(email: string): Promise<any> {
    try {
      // TODO: Check if user exists
      const exists = await this.user.findOne({ where: { email } });

      if (exists) {
        throw new BadRequestException('Account already exists');
      }

      // TODO: Create user
      const newUser = this.user.create({ email });
      const savedUser = await this.user.save(newUser);

      // TODO: Generate API key
      const key = this.generateApiKey();

      // TODO: Compute expiresAt = now + 1 year
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      // TODO: Insert API key
      const apiKeyEntity = this.apiKey.create({
        key,
        createdBy: savedUser,
        expiresAt,
      });

      await this.apiKey.save(apiKeyEntity);

      return {
        apiKey: key,
      };
    } catch (error) {
      throw error;
    }
  }
}
