import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  @Index()
  aggregateId: string;

  @Column({ type: 'varchar', length: 100 })
  @Index()
  aggregateType: string;

  @Column({ type: 'integer' })
  @Index()
  version: number;

  @Column({ type: 'varchar', length: 100 })
  @Index()
  type: string;

  @Column({ type: 'jsonb' })
  payload: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Index()
  created_at: Date;
} 