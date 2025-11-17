import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiKey } from './api-key.entity'; 

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToOne(() => ApiKey, (apiKey) => apiKey.createdBy)
  apiKey: ApiKey;
}
