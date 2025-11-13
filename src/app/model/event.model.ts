import { Elemento } from "./elements.model";

export interface Event {
  id: string;
  clientName: string;
  date: string;
  elements: string[];
  totalPrice: number;
  status: 'pending' | 'confirmed';
}


export interface newEvent {
  clientName: string;
  date: string;
  elements: Elemento[];
  totalPrice: number;
  status: 'pending' | 'confirmed';
}

