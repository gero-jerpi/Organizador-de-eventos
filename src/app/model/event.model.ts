import { Elemento } from './elements.model';

export interface Event {
  id: string;
  userId: string;
  date: string;
  elements: string[];
  totalPrice: number;
  status: 'Pendiente' | 'Confirmado'| 'Rechazado' | 'Finalizado';
}

export interface newEvent {
  userId: string;
  date: string;
  elements: string[];
  totalPrice: number;
  status: 'Pendiente' | 'Confirmado'| 'Rechazado' | 'Finalizado';
}
