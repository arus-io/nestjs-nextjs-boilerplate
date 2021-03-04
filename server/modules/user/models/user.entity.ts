import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../../company/models/company.entity';


@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'character varying', length: 255 })
  email: string;

  @Column({ type: 'character varying', length: 255, nullable: true })
  password: string | null;

  @Column({ type: 'boolean', default: false })
  twoFactorEnabledTOTP: boolean;

  @Column({ type: 'boolean', default: false })
  twoFactorEnabledSMS: boolean;

  @Column({ type: 'varchar', nullable: true })
  twoFactorSecret: string;

  @Column({ type: 'integer', default: 0 })
  twoFactorCounter: number;

  @Column({ type: 'character varying', length: 100, nullable: true })
  firstName: string | null;

  @Column({ type: 'character varying', length: 100, nullable: true })
  lastName: string | null;

  @Column({ type: 'boolean', nullable: true, default: false })
  superuser: boolean | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;

  @Column({ type: 'character varying', nullable: true, length: 255 })
  personalEmail: string | null;

  @Column({ type: 'character varying', nullable: true, length: 100 })
  phone: string | null;

  @Column({ type: 'character varying', nullable: true, length: 255, default: false }) // @TODO change def
  verificationToken: string | null;

  @ManyToOne(() => Company, { nullable: true })
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company!: Company;

}
