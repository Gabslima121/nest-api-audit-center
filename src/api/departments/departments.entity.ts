import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

import { Company } from '../company/company.entity';
import { Tickets } from '../tickets/tickets.entity';

@Entity('departments')
class Departments {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @JoinColumn({ name: 'company_id' })
  @ManyToOne(() => Company)
  company: Company;

  @Column()
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  @Exclude({ toPlainOnly: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  @Exclude({ toPlainOnly: true })
  deletedAt: Date;

  @OneToMany(() => Tickets, (ticket) => ticket.responsableArea)
  tickets?: Tickets[];

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { Departments };
