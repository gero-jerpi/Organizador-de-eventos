import { Component, inject } from '@angular/core';
import { EventService } from '../../services/event-service';

@Component({
  selector: 'app-event-form',
  imports: [],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
})
export class EventForm {
  private service = inject(EventService);



}
