import { Elemento } from './elements.model';

export interface Event {
  id: string;
  userId: string;
  clientName: string;
  date: string;
  elements: string[];
  totalPrice: number;
  status: 'pending' | 'confirmed';
}

export interface newEvent {
  userId: string;
  clientName: string;
  date: string;
  elements: string[];
  totalPrice: number;
  status: 'pending' | 'confirmed';
}
