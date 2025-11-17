import { Elemento } from './../../../model/elements.model';
import { Component, effect, Inject, inject, signal } from '@angular/core';
import { EventService } from '../../../services/event-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ElementsService } from '../../../services/element-service';
import { authGuard } from '../../../auth-guard';
import { UserService } from '../../../services/user-service';
import { Router, RouterModule } from '@angular/router';
import { newEvent } from '../../../model/event.model';
import { CommonModule } from '@angular/common';
import { Login } from '../login/login';

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


  finalPrice = signal<number>(0);

  eventTypes = [
    'Cumpleaños',
    'Casamiento',
    'Bautismo',
    'Fiesta de 15',
    'Aniversario',
    'Evento corporativo',
  ];

  menuTypes = ['Buffet', 'Vegetariano', 'Vegano', 'Infantil', 'Gourmet'];

  eventForm = this.fb.nonNullable.group({
    clientName: ['', Validators.required],
    date: ['', Validators.required],
    selectedElements: this.fb.control<string[]>([], Validators.required),
  });

  //Metodos

  getCategories() {
    return [...new Set(this.elements().map((e) => e.category))];
  }

  filterByCategory(category: string) {
    return this.elements().filter((e) => e.category === category);
  }

  selectedByCategory: { [category: string]: string } = {};

  calculateValues(id: string, category: string) {
    const element = this.elements().find((e) => e.id === id);
    if (!element) return;

    const previousId = this.selectedByCategory[category];

    if (previousId) {
      const previousElement = this.elements().find((e) => e.id === previousId);
      if (previousElement) {
        this.finalPrice.update((price) => price - previousElement.price);
      }
    }

    this.selectedByCategory[category] = id;

    this.finalPrice.update((price) => price + element.price);

    const ids = Object.values(this.selectedByCategory);
    this.eventForm.controls.selectedElements.setValue(ids as string[]);
  }

  cargarEvento() {

    if (this.eventForm.invalid) {
      alert("Datos invalidos")
      return;
    }

    const newEvent: newEvent = {
      userId: "NOSE COMO PASAR ESTO",
      clientName: this.eventForm.value.clientName!,
      date: this.eventForm.value.date!,
      elements: Object.values(this.selectedByCategory),
      totalPrice: this.finalPrice(),
      status: 'pending',
    };

    this.eventService.post(newEvent).subscribe(()=>{
      console.log("Evento creado");
      this.finalPrice.set(0)
      this.eventForm.reset()
      this.selectedByCategory = {}
      alert("Evento creado")
    })


  }

}
