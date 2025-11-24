
import { User } from './user.model';

export interface Event {
  id: string;
  user: User;
  eventType: string;
  guests: number;
  date: string;
  elements: string[];
  totalPrice: number;
  status: 'Pendiente' | 'Confirmado'| 'Rechazado' | 'Finalizado';
}

export interface newEvent {
  user: User;
  eventType: string;
  guests: number;
  date: string;
  elements: string[];
  totalPrice: number;
  status: 'Pendiente' | 'Confirmado'| 'Rechazado' | 'Finalizado';
}
