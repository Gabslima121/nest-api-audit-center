interface CreateTicketsDTO {
  title: string;
  responsable: string;
  responsableArea: string;
  analyst: string;
  status: string;
  sla: string;
  company: string;
  openDate: Date;
  limitDate: Date;
  closeDate: Date;
  description?: string;
}

interface TicketQuery {
  ticketStatus: string;
}

interface UpdateTicket {
  title: string;
  responsable: string;
  responsableArea: string;
  analyst: string;
  status: string;
  sla: string;
  company: string;
  openDate: Date;
  limitDate: Date;
  closeDate: Date;
  description?: string;
}

export { CreateTicketsDTO, TicketQuery, UpdateTicket };
