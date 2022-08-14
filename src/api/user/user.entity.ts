import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Company } from '../company/company.entity';
import { Departments } from '../departments/departments.entity';
import { Role } from '../role/role.entity';

@Entity('users')
class User {
  @PrimaryColumn()
  id?: string;

  @Column()
  name?: string;

  @Column()
  email?: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password?: string;

  @Column()
  cpf?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ name: 'is_deleted', default: false })
  isDeleted?: boolean;

  @Exclude()
  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @ManyToMany((type) => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles?: Role[];

  @Column({ name: 'company_id', nullable: true })
  companyId?: string;

  @JoinColumn({ name: 'company_id' })
  @ManyToOne(() => Company)
  companies?: Company;

  @Column({ name: 'department_id', nullable: true })
  departmentId: string;

  @JoinColumn({ name: 'department_id' })
  @ManyToOne(() => Departments)
  department?: Departments;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { User };
