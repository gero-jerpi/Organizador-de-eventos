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
  eventData: any = null;

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
      console.log('EVENTO RECIBIDO:', event);

      if (!event) {
        console.error('NO SE ENCONTRÓ EL EVENTO');
        return;
      }

      this.eventData = event;

      if (this.currentUser.role === 'admin') {
        this.mode = 'admin';
      } else if (event.userId === this.currentUser.id.toString()) {
        this.mode = 'client';
      } else {
        this.router.navigate(['/']);
        return;
      }

      this.cdr.detectChanges();
    });
  }

  /*
  loadEvent() {
    this.eventService.getById(this.eventId).subscribe((event) => {
      console.log('Evento recibido:', event);

      this.eventData = event;

      if (!event) return;

      if (this.currentUser.role === 'admin') {
        this.mode = 'admin';
        return;
      }

      if (event.userId === this.currentUser.id.toString()) {
        this.mode = 'client';
        return;
      }

      this.router.navigate(['/']);
    });
  }
    */
}
