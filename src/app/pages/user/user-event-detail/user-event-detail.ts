import { Elemento } from './../../../model/elements.model';
import { Event } from './../../../model/event.model';
import { Component, effect, inject, signal } from '@angular/core';
import { EventService } from '../../../services/event-service';
import { ActivatedRoute } from '@angular/router';
import { ElementsService } from '../../../services/element-service';

@Component({
  selector: 'app-user-event-detail',
  imports: [],
  templateUrl: './user-event-detail.html',
  styleUrl: './user-event-detail.css',
})
export class UserEventDetail {
  private eventService = inject(EventService);
  private route = inject(ActivatedRoute);
  private elementService = inject(ElementsService);

  foundEvent = signal<Event | null>(null);
  elements: Elemento[] = [];

  constructor() {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('id');

      this.elements = this.elementService.elements();

      if (id) {
        this.eventRender(id);
      }
    });
  }

  eventRender(id: string) {
    this.eventService.getById(id).subscribe((foundEvent) => {
      this.foundEvent.set(foundEvent);
      console.log(foundEvent);
    });
  }

  getElementById(id: string) {
    return this.elements.find((e) => e.id === id);
  }
}
