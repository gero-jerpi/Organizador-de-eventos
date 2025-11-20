import { Elemento } from './../../../model/elements.model';
import { Component, inject } from '@angular/core';
import { EventService } from '../../../services/event-service';
import { Event } from '../../../model/event.model';
import { ElementsService } from '../../../services/element-service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-event-list',
  imports: [RouterModule],
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
    const newStatus = event.status === 'confirmed' ? 'pending' : 'confirmed';
    this.eventService.patch(event.id, newStatus).subscribe(() => {
      console.log('eliminado');
    });
  }

  findById(id: string) {
    return this.elements().find((elementFound) => elementFound.id === id);
  }
}
