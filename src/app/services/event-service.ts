import { Event, newEvent } from './../model/event.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  /// Api
  private apiUrl = 'http://localhost:3000/events';

  /// Variables
  private eventsSignal = signal<Event[]>([]);
  public events = this.eventsSignal.asReadonly();
  private eventToUpdateSignal = signal<Event | null>(null);
  public eventToUpdate = this.eventToUpdateSignal.asReadonly();

  /// Constructor
  constructor(private http: HttpClient) {
    this.getAll();
  }

  /// Methods

  //Obtener todos los eventos
  getAll() {
    this.http.get<Event[]>(this.apiUrl).subscribe((data) => {
      this.eventsSignal.set(data);
    });
  }

  //Obtener eventos por userId
  getByUser(userId: number): Event[] {
    return this.eventsSignal().filter((ev) => ev.userId === userId);
  }

  //Crear evento
  post(newEvent: newEvent): Observable<Event> {
    return this.http
      .post<Event>(this.apiUrl, newEvent)
      .pipe(tap((eventCreated) => this.eventsSignal.update((events) => [...events, eventCreated])));
  }

  //Actualizar evento
  put(eventToUpdate: Event): Observable<Event> {
    return this.http
      .put<Event>(`${this.apiUrl}/${eventToUpdate.id}`, eventToUpdate)
      .pipe(
        tap((eventUpdated) =>
          this.eventsSignal.update((events) =>
            events.map((event) => (event.id === eventUpdated.id ? eventUpdated : event))
          )
        )
      );
  }

  //Eliminar evento
  delete(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => this.eventsSignal.update((events) => events.filter((event) => event.id !== id)))
      );
  }

  //Cambiar estado (pendiente / confirmado)
  patch(id: string, newStatus: 'pending' | 'confirmed'): Observable<Event> {
    return this.http
      .patch<Event>(`${this.apiUrl}/${id}`, { status: newStatus })
      .pipe(
        tap((eventUpdated) =>
          this.eventsSignal.update((events) =>
            events.map((event) =>
              event.id === id ? { ...event, status: eventUpdated.status } : event
            )
          )
        )
      );
  }

  //Gestionar evento a editar
  addEventToUpdate(event: Event) {
    this.eventToUpdateSignal.set(event);
  }

  clearEventToUpdate() {
    this.eventToUpdateSignal.set(null);
  }
}
