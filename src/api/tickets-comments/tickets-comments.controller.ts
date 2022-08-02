import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/user.entity';
import { CreateTicketComment } from './tickets-comments.dto';
import { TicketsComments } from './tickets-comments.entity';
import { TicketsCommentsService } from './tickets-comments.service';

@Controller('tickets-comments')
export class TicketsCommentsController {
  @Inject(TicketsCommentsService)
  private readonly ticketsCommentsService: TicketsCommentsService;

  @Post('create/:ticketId')
  public async createTicketComment(
    @Body() { content }: CreateTicketComment,
    @Param('ticketId') ticketId: string,
    @CurrentUser() user: User,
  ): Promise<TicketsComments> {
    try {
      return await this.ticketsCommentsService.createTicketComment({
        authorId: user?.id,
        content,
        ticketId,
      });
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Get('/:ticketId')
  public async getTicketsCommentsByTicketId(
    @Param('ticketId') ticketId: string,
  ): Promise<TicketsComments[]> {
    try {
      return await this.ticketsCommentsService.getTicketsCommentsByTicketId(
        ticketId,
      );
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  @Delete('delete/:id')
  public async deleteComment(@Param('id') id: string): Promise<void> {
    try {
      return await this.ticketsCommentsService.deleteComment(id);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}
