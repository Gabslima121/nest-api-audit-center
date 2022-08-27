import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TicketsCommentsService } from './tickets-comments.service';
import { TicketsCommentsController } from './tickets-comments.controller';
import { TicketsCommentsRepository } from './tickets-comments.repository';
import { TicketsComments } from './tickets-comments.entity';
import { TicketsModule } from '../tickets/tickets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketsComments]),
    forwardRef(() => TicketsModule),
  ],
  providers: [TicketsCommentsService, TicketsCommentsRepository],
  controllers: [TicketsCommentsController],
  exports: [TicketsCommentsService, TicketsCommentsRepository],
})
export class TicketsCommentsModule {}
