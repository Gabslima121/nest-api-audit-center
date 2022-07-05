interface CreateTicketsDTO {
  title: string;
  responsableId: string;
  responsableAreaId: string;
  analystId: string;
  status: string;
  sla: string;
  companyId: string;
  openDate: Date;
  limitDate: Date;
  closeDate: Date;
  description?: string;
}

export { CreateTicketsDTO };
