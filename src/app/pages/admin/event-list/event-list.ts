import { Component, inject } from '@angular/core';
import { EventService } from '../../../services/event-service';
import { Event } from '../../../model/event.model';

@Component({
  selector: 'app-event-list',
  imports: [],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css',
})
export class EventList {
  private service = inject(EventService)
  events = this.service.events

  delete(id: string){
      if(confirm("Seguro desea eliminar?")){
          this.service.delete(id).subscribe(()=>{
            console.log("Eliminado");
          })
      }
  }

  patch(event: Event){
    const newStatus = event.status === 'confirmed' ? 'pending' : 'confirmed';
    this.service.patch(event.id, newStatus).subscribe(()=>{
      console.log("eliminado");
    })
  }


}
