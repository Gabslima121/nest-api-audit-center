import { Inject, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import * as moment from 'moment';

import { TicketsService } from '../tickets/tickets.service';
import { CreateTicketComment } from './tickets-comments.dto';
import { TicketsComments } from './tickets-comments.entity';
import { TicketsCommentsRepository } from './tickets-comments.repository';

@Injectable()
export class TicketsCommentsService {
  private ticketsCommentsRepository: TicketsCommentsRepository;

  constructor(private readonly connection: Connection) {
    this.ticketsCommentsRepository = this.connection.getCustomRepository(
      TicketsCommentsRepository,
    );
  }

  @Inject(TicketsService)
  private readonly ticketsService: TicketsService;

  public async createTicketComment({
    authorId,
    content,
    ticketId,
  }: CreateTicketComment): Promise<TicketsComments> {
    const ticketComment = new TicketsComments();

    const ticketExists = await this.ticketsService.findTicketById(ticketId);

    if (!ticketExists) {
      throw new Error('ticket_not_found');
    }

    ticketComment.authorId = authorId;
    ticketComment.content = content;
    ticketComment.registeredAt = new Date();
    ticketComment.ticketId = ticketId;

    return this.ticketsCommentsRepository.save(ticketComment);
  }

  public async getTicketsCommentsByTicketId(
    ticketId: string,
  ): Promise<TicketsComments[]> {
    const ticketComment = await this.ticketsCommentsRepository.find({
      where: { ticketId },
      order: { registeredAt: 'ASC' },
      relations: ['author', 'ticket'],
    });

    if (!ticketComment) {
      throw new Error('ticket_not_found');
    }

    return ticketComment;
  }

  public async getCommentById(id: string): Promise<TicketsComments> {
    const comment = await this.ticketsCommentsRepository.findOne(id);

    if (!comment) {
      throw new Error('comment_not_found');
    }

    return comment;
  }

  public async deleteComment(id: string): Promise<void> {
    const comment = await this.getCommentById(id);

    await this.ticketsCommentsRepository.softDelete(comment?.id);
  }
}
