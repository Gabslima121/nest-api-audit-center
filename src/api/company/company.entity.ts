import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Sla } from '../sla/sla.entity';

@Entity('company')
class Company {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'corporate_name' })
  corporateName: string;

  @Column()
  cnpj: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column()
  cep: string;

  @Column()
  neighborhood: string;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column({ nullable: true })
  complement?: string;

  @CreateDateColumn({ name: 'created_at' })
  @Exclude({ toPlainOnly: true })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Exclude({ toPlainOnly: true })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  @Exclude({ toPlainOnly: true })
  deletedAt!: Date;

  // @ManyToOne(() => Sla, (sla) => sla.company)
  // slaId: Sla;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { Company };
