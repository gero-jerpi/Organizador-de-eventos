import { Event } from './../../model/event.model';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { EventService } from '../../services/event-service';
import { UserService } from '../../services/user-service';
import { ElementsService } from '../../services/element-service';
import { Signal } from '@angular/core';
import { signal } from '@angular/core';
import { effect } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css',
})
export class EventDetail implements OnInit {
  eventId!: string;
  eventData = signal<Event | null>(null);
  currentUser: any = null;
  mode: 'admin' | 'client' = 'client';
  elements = signal<any[]>([]);

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private userService: UserService,
    private elementService: ElementsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    effect(() => {
      const elems = this.elementService.elements();
      if (elems) this.elements.set(elems);
    });
  }

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id')!;

    this.currentUser = this.userService.currentUser();

    console.log('Usuario cargado:', this.currentUser);

    if (!this.currentUser) {
      console.error('Usuario no cargado todavía');
      return;
    }

    this.loadEvent();
  }

  loadEvent() {
    console.log('CARGANDO EVENTO...', this.eventId);

    this.eventService.getById(this.eventId).subscribe((event) => {
      if (!event) return;

      this.eventData.set(event);

      if (this.currentUser.role === 'admin') {
        this.mode = 'admin';
      } else if (event.userId === this.currentUser.id.toString()) {
        this.mode = 'client';
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  confirmar(id: string) {
    this.eventService.patch(id, 'Confirmado').subscribe(() => {
      const ev = this.eventData(); // obtenemos el valor actual
      if (!ev) return; // si es null, no hacemos nada
      this.eventData.set({
        ...ev,
        status: 'Confirmado',
      });
    });
  }

  rechazar(id: string) {
    this.eventService.patch(id, 'Rechazado').subscribe(() => {
      const ev = this.eventData();
      if (!ev) return;
      this.eventData.set({
        ...ev,
        status: 'Rechazado',
      });
    });
  }

  finalizado(id: string) {
    this.eventService.patch(id, 'Finalizado').subscribe(() => {
      const ev = this.eventData();
      if (!ev) return;
      this.eventData.set({
        ...ev,
        status: 'Finalizado',
      });
    });
  }

  eliminar(id: string) {
    this.eventService.delete(id).subscribe(() => {
      console.log('Eliminado');
      this.router.navigate(['/admin/event-list'])
    });
  }

  volver(){
    this.router.navigate(['/admin/event-list'])
  }


}
