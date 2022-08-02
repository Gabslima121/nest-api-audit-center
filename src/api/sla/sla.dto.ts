export interface CreateSlaDTO {
  name: string;
  sla: number;
  typeSla: string;
  description?: string;
  company: string;
}

export interface UpdateSlaDTO {
  name: string;
  sla: number;
  typeSla: string;
  description?: string;
}
