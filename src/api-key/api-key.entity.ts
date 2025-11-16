import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../auth/users.entity';

// src/api-keys/api-key.entity.ts
@Entity()
export class ApiKey {
  @PrimaryGeneratedColumn()
  keyId: number;

  @Column({ unique: true, nullable: false })
  key: string;

  @Column({ type: 'tinyint', default: 0 })
  revoked: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: false })
  expiresAt: Date;

  @OneToOne(() => User, (user) => user.apiKey)
  @JoinColumn({name: 'createdBy'})
  createdBy: User;
}
