import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { v4 as uuid } from 'uuid';

import { Company } from '../company/company.entity';
import { User } from '../user/user.entity';

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
  @ManyToOne(() => User)
  responsableArea: User;

  @Column({ name: 'analyst_id' })
  analystId: string;

  @JoinColumn({ name: 'analyst_id' })
  @ManyToOne(() => User)
  analyst: User;

  @Column({ name: 'status', default: 'open' })
  status: string;

  @Column({ name: 'sla' })
  sla: string;

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

  @Column({ name: 'created_at', default: 'now()' })
  @Exclude()
  createdAt: Date;

  @Column({ name: 'updated_at', default: 'now()' })
  @Exclude()
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  @Exclude()
  deletedAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { Tickets };
