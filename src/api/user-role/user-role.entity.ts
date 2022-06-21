import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { Role } from '../role/role.entity';
import { User } from '../user/user.entity';

@Entity('user_role')
class UserRole {
  @PrimaryColumn()
  id?: string;

  @Column({ type: 'varchar', nullable: false, name: 'user_id' })
  userId: string;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User)
  user_id: User;

  @Column({ type: 'varchar', nullable: false, name: 'role_id' })
  roleId: string;

  @JoinColumn({ name: 'role_id' })
  @ManyToOne(() => Role)
  role_id: Role;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { UserRole };
