import { Elemento } from './elements.model';

export interface Event {
  id: string;
  userId: string;
  date: Date;
  elements: string[];
  totalPrice: number;
  status: 'pending' | 'confirmed';
}

export interface newEvent {
  userId: string;
  date: Date;
  elements: string[];
  totalPrice: number;
  status: 'pending' | 'confirmed';
}
