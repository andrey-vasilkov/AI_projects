export type ApplicationStatus = 'Новая' | 'В работе' | 'Завершена';

export interface Application {
  id: string;
  clientName: string;
  contact: string;
  text: string;
  status: ApplicationStatus;
  createdAt: string;
}
