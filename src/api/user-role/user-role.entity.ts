import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Role } from '../role/role.entity';
import { User } from '../user/user.entity';

@Entity('user_roles')
class UserRole {
  @PrimaryColumn()
  id?: string;

  @Column({ nullable: false, name: 'user_id' })
  userId: string;

  @Column({ nullable: false, name: 'role_id' })
  roleId: string;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne((type) => User, { eager: true })
  user_id: User;

  @JoinColumn({ name: 'role_id' })
  @ManyToOne((type) => Role, { eager: true })
  role_id: Role;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { UserRole };
