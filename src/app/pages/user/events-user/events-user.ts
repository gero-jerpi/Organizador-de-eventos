import { Component, effect, inject, signal } from '@angular/core';
import { EventService } from '../../../services/event-service';
import { UserService } from '../../../services/user-service';
import { Event } from '../../../model/event.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-events-user',
  imports: [CommonModule,RouterModule],
  templateUrl: './events-user.html',
  styleUrl: './events-user.css',
})
export class EventsUser {

  private eventService = inject(EventService);
  private userService = inject(UserService)

  eventos = signal<Event[]>([])

  constructor(){
    this.loadEvents()
  }

  loadEvents(){
    const user = this.userService.currentUser();

    if(!user || !user.id){
      return;
    }

    console.log(user.id);


    this.eventService.getEventsByUserId(user.id).subscribe((data)=>{
      this.eventos.set(data);
    })
  }
}

