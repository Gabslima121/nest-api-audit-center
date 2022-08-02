import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Company } from '../company/company.entity';

@Entity('sla')
class Sla {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  sla: number;

  @Column({
    name: 'type_sla',
    type: 'enum',
    enum: ['minutes', 'hours', 'days', 'weeks', 'months'],
  })
  typeSla: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @JoinColumn({ name: 'company_id' })
  @ManyToOne(() => Company)
  company: Company;

  @Exclude()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { Sla };
