import { Elemento } from './../../../model/elements.model';
import { Component, inject } from '@angular/core';
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
