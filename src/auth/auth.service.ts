import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { User } from './users.entity';
import { ApiKey } from './api-key.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private user: Repository<User>,
    @InjectRepository(ApiKey) private apiKey: Repository<ApiKey>,
  ) {}

  /**
   * * generate API key
   * @returns {Object}
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

  /**
   * * Get Api key
   * @param email
   * @returns {Object}
   */
  async getApikey(email: string): Promise<any> {
    try {
      const user = await this.user.findOne({
        where: { email },
        select: ['userId'],
      });

      if (!user) {
        throw new BadRequestException('Invalid Email, Please Register First');
      }

      const apiKey = await this.apiKey.findOne({
        where: {
          createdBy: { userId: user.userId },
          revoked: 0,
          expiresAt: MoreThan(new Date()),
        },
        select: {
          keyId: true,
          key: true,
        },
      });

      if (!apiKey) {
        throw new NotFoundException(
          'No valid API Key found (expired or revoked)',
        );
      }

      return {
        apiKey: apiKey.key,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * * Revoke API-key
   * @param email
   * @returns {Object}
   */
  async revokeKey(email: string): Promise<any> {
    try {
      const user = await this.user.findOne({
        where: { email },
        select: ['userId'],
      });

      if (!user) {
        throw new BadRequestException('Invalid Email, Please Register First');
      }

      const apiKey = await this.apiKey.findOne({
        where: {
          createdBy: { userId: user.userId },
          revoked: 0,
          expiresAt: MoreThan(new Date()),
        },
      });

      if (!apiKey) {
        throw new NotFoundException('No active API key found for this user');
      }

      // 3. Revoke the key
      apiKey.revoked = 1;
      await this.apiKey.save(apiKey);

      return {
        keyId: apiKey.keyId
      };
    } catch (error) {
      throw error;
    }
  }
}
