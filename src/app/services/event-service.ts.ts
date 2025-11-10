import { Event, newEvent } from './../model/event.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventServiceTs {
  /// Api
  private apiUrl = 'http://localhost:3000/events';


  /// Variables
  private eventsSignal = signal<Event[]>([]);
  public events = this.eventsSignal.asReadonly();


  /// Variables && methods to update
  private eventToUpdateSignal = signal<Event | null>(null)
  public eventToUpdate = this.eventToUpdateSignal.asReadonly();

  addEventToUpdate(event: Event){
    this.eventToUpdateSignal.set(event);
  }

  clearEventToUpdate(){
    this.eventToUpdateSignal.set(null);
  }


  /// Constructor
  constructor(private http: HttpClient){
    this.get()
  }


  /// Methods
  get(){
    this.http.get<Event[]>(this.apiUrl).subscribe((data)=>{
      this.eventsSignal.set(data);
    })
  }

  post(newEvent: newEvent): Observable<Event>{
    return this.http.post<Event>(this.apiUrl, newEvent).pipe(
      tap(eventCreated =>
        this.eventsSignal.update(events =>
          [...events, eventCreated]
        )
      )
    )
  }

  delete(id: string): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() =>
        this.eventsSignal.update(events =>
          events.filter(event=>
            event.id !== id
          )
        )
      )
    )
  }

  put(eventToUpdate: Event): Observable<Event>{
    return this.http.put<Event>(`${this.apiUrl}/${eventToUpdate.id}`, eventToUpdate).pipe(
      tap(eventUpdated=>
        this.eventsSignal.update(events =>
          events.map(event =>
            event.id === eventUpdated.id ? eventUpdated : event
          )
        )
      )
    )
  }



}
