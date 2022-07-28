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

@Entity('ticket_items')
class TicketItems {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'ticket_id' })
  ticketId: string;

  @JoinColumn({ name: 'ticket_id' })
  @ManyToOne(() => Tickets)
  ticket: Tickets;

  @Column()
  item: string;

  @Column()
  status: string;

  @Column()
  description: string;

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

export { TicketItems };
