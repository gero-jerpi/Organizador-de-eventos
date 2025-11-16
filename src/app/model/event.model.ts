import { Elemento } from './elements.model';

export interface Event {
  id: number;
  userId: number;
  clientName: string;
  date: string;
  elements: number[];
  totalPrice: number;
  status: 'pending' | 'confirmed';
}

export interface newEvent {
  userId: number;
  clientName: string;
  date: string;
  elements: number[];
  totalPrice: number;
  status: 'pending' | 'confirmed';
}
