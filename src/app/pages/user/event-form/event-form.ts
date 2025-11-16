import { Elemento } from './../../../model/elements.model';
import { Component, effect, Inject, inject } from '@angular/core';
import { EventService } from '../../../services/event-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ElementsService } from '../../../services/element-service';
import { authGuard } from '../../../auth-guard';
import { UserService } from '../../../services/user-service';
import { Router, RouterModule } from '@angular/router';
import { newEvent } from '../../../model/event.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-form',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
})
export class EventForm {
  private fb = inject(FormBuilder);
  private user = inject(UserService);
  private eventService = inject(EventService);
  private router = inject(Router);
  private elementService = inject(ElementsService);
  elements = this.elementService.elements;

  eventTypes = [
    'Cumpleaños',
    'Casamiento',
    'Bautismo',
    'Fiesta de 15',
    'Aniversario',
    'Evento corporativo',
  ];

  menuTypes = ['Buffet', 'Vegetariano', 'Vegano', 'Infantil', 'Gourmet'];

  eventForm = this.fb.group({
  clientName: ['', Validators.required],
  date: ['', Validators.required],
  selectedElements: this.fb.control<number[]>([], Validators.required),
});

  //Metodos

  getCategories() {
    return [...new Set(this.elements().map((e) => e.category))];
  }

  filterByCategory(category: string) {
    return this.elements().filter((e) => e.category === category);
  }

  verValor(id: any) {
    console.log(id);
  }

  calcularTotal(): number {
    const selectedIds = this.eventForm.value.selectedElements ?? [];

    return this.elements()
      .filter((e) => selectedIds.includes(Number(e.id)))
      .reduce((total, e) => total + e.price, 0);
  }

  createEvent() {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    const user = this.user.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    const newEvent = {
      clientName: this.eventForm.value.clientName!,
      date: this.eventForm.value.date!,
      elements: this.eventForm.value.selectedElements!,
      totalPrice: this.calcularTotal(),
      userId: user.id!,
      status: 'pending' as 'pending',
    };

    this.eventService.post(newEvent).subscribe(() => {
      alert('Evento creado con exito');
    });
  }
}
