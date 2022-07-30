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
import { Tickets } from '../tickets/tickets.entity';
import { User } from '../user/user.entity';

@Entity('tickets_comments')
class TicketsComments {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'ticket_id' })
  ticketId: string;

  @JoinColumn({ name: 'ticket_id' })
  @ManyToOne(() => Tickets)
  ticket: Tickets;

  @Column({ name: 'author_id' })
  authorId: string;

  @JoinColumn({ name: 'author_id' })
  @ManyToOne(() => User)
  author: User;

  @Column()
  content: string;

  @Column({ name: 'registered_at' })
  registeredAt: Date;

  @Exclude()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  constructor() {
    if (!this.id) this.id = uuid();
  }
}

export { TicketsComments };
