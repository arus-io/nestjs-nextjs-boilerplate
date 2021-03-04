import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'companies' })
export class Company {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'character varying', length: 255, nullable: true })
  name: string | null;

  @Column({ type: 'character varying', length: 255 })
  subdomain: string;

  @Column({ type: 'character varying', length: 255, nullable: true })
  supportEmail: string;

  @Column({ type: 'boolean', default: false })
  twoFactorEnabled: boolean;

  @Column({ type: 'character varying', length: 255, nullable: true })
  logo: string | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;
}
