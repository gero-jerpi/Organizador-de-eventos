import { Elemento } from "./elements.model";

export interface Event {
  id: number;
  userId: number;
  date: string;
  elements: number[];
  totalPrice: number;
  status: 'pending' | 'confirmed';
}


export interface newEvent {
  userId: number;
  date: string;
  elements: number[];
  totalPrice: number;
  status: 'pending' | 'confirmed';
}

