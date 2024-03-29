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
import { Exclude } from 'class-transformer';
import { v4 as uuid } from 'uuid';

import { Company } from '../company/company.entity';
import { User } from '../user/user.entity';
import { Departments } from '../departments/departments.entity';
import { Sla } from '../sla/sla.entity';

@Entity('tickets')
class Tickets {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column({ name: 'responsable_id' })
  responsableId: string;

  @JoinColumn({ name: 'responsable_id' })
  @ManyToOne(() => User)
  responsable: User;

  @Column({ name: 'responsable_area_id' })
  responsableAreaId: string;

  @JoinColumn({ name: 'responsable_area_id' })
  @ManyToOne(() => Departments)
  responsableArea: Departments;

  @Column({ name: 'analyst_id' })
  analystId: string;

  @JoinColumn({ name: 'analyst_id' })
  @ManyToOne(() => User)
  analyst: User;

  @Column({ name: 'status', default: 'open' })
  status: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @JoinColumn({ name: 'company_id' })
  @ManyToOne(() => Company)
  company: Company;

  @Column({ name: 'open_date', default: 'now()' })
  openDate: Date;

  @Column({ name: 'limit_date' })
  limitDate: Date;

  @Column({ name: 'close_date' })
  closeDate: Date;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'sla_id' })
  slaId: string;

  @JoinColumn({ name: 'sla_id' })
  @ManyToOne(() => Sla)
  sla: Sla;

  @CreateDateColumn({ name: 'created_at', default: 'now()' })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: 'now()' })
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  @Exclude()
  deletedAt: Date;

  total?: number;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { Tickets };
