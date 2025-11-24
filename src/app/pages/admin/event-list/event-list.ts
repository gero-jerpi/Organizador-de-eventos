import { Elemento } from './../../../model/elements.model';
import { Component, computed, inject, signal } from '@angular/core';
import { EventService } from '../../../services/event-service';
import { Event } from '../../../model/event.model';
import { ElementsService } from '../../../services/element-service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-event-list',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './event-list.html',
  styleUrl: './event-list.css',
})
export class EventList {
  private eventService = inject(EventService);
  events = this.eventService.events;

  private elementService = inject(ElementsService);
  elements = this.elementService.elements;

  filterMode = signal<'all' | 'past' | 'future'>('all');

  filteredEvents = computed(() => {
  let all = this.events() ?? [];

  // ORDENAR PRIMERO
  all = [...all].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB; // ASCENDENTE (más viejo → más nuevo)
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // LUEGO FILTRAR
  return all.filter(ev => {
    const evDate = new Date(ev.date + 'T00:00:00');

    if (this.filterMode() === 'past') {
      return evDate.getTime() < today.getTime();
    }
    if (this.filterMode() === 'future') {
      return evDate.getTime() >= today.getTime();
    }
    return true;
  });
});

setFilter(mode: 'all' | 'past' | 'future') {
  this.filterMode.set(mode);
}



  delete(id: string) {
    if (confirm('Seguro desea eliminar?')) {
      this.eventService.delete(id).subscribe(() => {
        console.log('Eliminado');
      });
    }
  }
patch(event: Event) {
  const estados = ['Pendiente', 'Confirmado', 'Rechazado', 'Finalizado'] as const;

  // Normalizar lo que venga de la base
  const estado = event.status.toLowerCase();

  let estadoNormalizado = '';

  if (estado.startsWith('pend')) estadoNormalizado = 'Pendiente';
  else if (estado.startsWith('conf')) estadoNormalizado = 'Confirmado';
  else if (estado.startsWith('rech')) estadoNormalizado = 'Rechazado';
  else if (estado.startsWith('fina')) estadoNormalizado = 'Finalizado';

  const indexActual = estados.indexOf(estadoNormalizado as any);
  const siguienteIndex = (indexActual + 1) % estados.length;

  const newStatus = estados[siguienteIndex];

  this.eventService.patch(event.id, newStatus).subscribe(() => {
    console.log("Estado actualizado a:", newStatus);
  });
}


  findById(id: string) {
    return this.elements().find((elementFound) => elementFound.id === id);
  }
}
