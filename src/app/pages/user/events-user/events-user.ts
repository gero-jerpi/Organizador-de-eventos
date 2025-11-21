import { Component, effect, inject } from '@angular/core';
import { EventService } from '../../../services/event-service';
import { UserService } from '../../../services/user-service';
import { Event } from '../../../model/event.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-events-user',
  imports: [CommonModule],
  templateUrl: './events-user.html',
  styleUrl: './events-user.css',
})
export class EventsUser {

 private eventService = inject(EventService);
  private userService = inject(UserService);

  eventos: Event[] = [];
  loading = true;

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {

    const user = this.userService.currentUser();

    if (!user) {
      this.loading = true;
      setTimeout(() => this.loadEvents(), 80);
      return;
    }

    this.loading = true;

    this.eventService.getEventsByUserId(user.id!.toString())
      .subscribe({
        next: (data) => {
          // aseguramos actualización del template
          setTimeout(() => {
            this.eventos = data;
            this.loading = false;
          }, 0);
        },
        error: () => {
          this.loading = false;
        }
      });
  }

}

