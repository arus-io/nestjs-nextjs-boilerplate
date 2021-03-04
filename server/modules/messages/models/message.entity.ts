import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../user/models/user.entity';

export enum Medium {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}
@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'integer', nullable: true })
  initiatorId!: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn([{ name: 'initiatorId', referencedColumnName: 'id' }])
  initiator!: User; // null means the app, otherwise the user who initiated the message

  @Column({ type: 'integer', nullable: true })
  receiverId!: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn([{ name: 'receiverId', referencedColumnName: 'id' }])
  receiver!: User;

  @Column({ type: 'character varying', length: 32 })
  code: string;

  @Column({ type: 'character varying', length: 128 })
  to: string;

  @Column({ type: 'character varying', length: 128 })
  from: string;

  @Column({ type: 'character varying', length: 128, default: '' })
  subject: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'text', nullable: true })
  error: string;

  @Column({ type: 'enum', enum: Medium })
  medium: Medium;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
