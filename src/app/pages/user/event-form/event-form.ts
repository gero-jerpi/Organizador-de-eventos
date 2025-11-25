import { filter, map } from 'rxjs';
import { Component, effect, inject, signal } from '@angular/core';
import { EventService } from '../../../services/event-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ElementsService } from '../../../services/element-service';
import { UserService } from '../../../services/user-service';
import { Router, RouterModule } from '@angular/router';
import { newEvent } from '../../../model/event.model';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-event-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
})
export class EventForm {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private eventService = inject(EventService);
  private elementService = inject(ElementsService);
  private router = inject(Router);

  occupiedDates = signal<string[]>([]);

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const formatted = date.toISOString().split('T')[0];
    const isNotOccupied = !this.occupiedDates().includes(formatted);

    return date >= today && isNotOccupied;
  };

  finalPrice = signal<number>(0);
  elements = signal<any[]>([]);

  selectedByCategory: { [category: string]: string } = {};
  selectedMenu: any = null;
  foodTotal: number = 0;

  readonly REQUIRED_CATEGORIES = ['Menú'];

  readonly eventTypes = [
    'Cumpleaños',
    'Casamiento',
    'Fiesta de 15',
    'Evento corporativo',
    'Bautismo',
    'Aniversario',
  ];

  eventForm = this.fb.group({
    date: ['', [Validators.required, this.noPastDateValidator]],
    guests: [0, Validators.required],
    eventType: ['', Validators.required],
    menuType: [''],
    selectedElements: this.fb.control<string[]>([]),
  });

  noPastDateValidator(control: any) {
  if (!control.value) return null;

  const selected = new Date(control.value);
  const today = new Date();

  selected.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return selected < today ? { pastDate: true } : null;
}

  constructor() {
    effect(() => {
      const eventos = this.eventService.events;
      const date = eventos().map((e) => e.date);
      if (!date) {
        return;
      }

      this.occupiedDates.set(date);

      const elems = this.elementService.elements();
      if (!elems) return;
      this.elements.set(elems);
    });
    this.eventForm.get('guests')?.valueChanges.subscribe(() => {
      this.calculateTotal();
    });

    this.eventForm.get('eventType')?.valueChanges.subscribe(() => {
      this.calculateTotal();
    });

  }

  // ─────────────────────────────────────────────────────
  // SELECCIÓN DE ELEMENTOS
  // ─────────────────────────────────────────────────────
  getCategories() {
    return [...new Set(this.elements().map((e) => e.category))];
  }

  filterByCategory(category: string) {
    return this.elements().filter((e) => e.category === category);
  }

  isRequired(category: string): boolean {
    return this.REQUIRED_CATEGORIES.includes(category);
  }

  selectOption(category: string, id: string) {
    const current = this.selectedByCategory[category];
    if (current === id) {
      const prevEl = this.elements().find((e: any) => e.id === current);
      if (prevEl) {
        this.finalPrice.update((p) => p - prevEl.price);
      }
      delete this.selectedByCategory[category];

      if (category === 'Menú') {
        this.eventForm.controls.menuType.setValue('');
      }
    } else {
      this.calculateValues(id, category);

      if (category === 'Menú') {
        this.eventForm.controls.menuType.setValue(this.selectedByCategory['Menú'] || '');
      }
      return;
    }
    const ids = Object.values(this.selectedByCategory);
    this.eventForm.controls.selectedElements.setValue(ids as string[]);
    this.calculateTotal();
  }

  // ─────────────────────────────────────────────────────
  // CÁLCULO TOTAL
  // ─────────────────────────────────────────────────────

  calculateValues(id: string, category: string) {
    const element = this.elements().find((e) => e.id === id);
    if (!element) return;

    this.selectedByCategory[category] = id;

    const ids = Object.values(this.selectedByCategory);
    this.eventForm.controls.selectedElements.setValue(ids as string[]);

    if (category === 'Menú') {
      this.eventForm.patchValue({ menuType: id });
    }

    this.calculateTotal();
  }

  calculateTotal(): number {
    const raw = this.eventForm.getRawValue();
    const guests = raw.guests ?? 0;
    const eventType = raw.eventType ?? '';
    const selectedElements = raw.selectedElements ?? [];

    let total = 0;

    const allElems = this.elements();

    // Encontrar menú seleccionado
    let selectedMenu: any = null;
    selectedElements.forEach((id) => {
      const el = allElems.find((e) => e.id === id);
      if (el && el.category === 'Menú') {
        selectedMenu = el;
      }
    });

    this.selectedMenu = selectedMenu;

    if (selectedMenu) {
      const foodTotal = guests * selectedMenu.price;
      this.foodTotal = foodTotal;
      total += foodTotal;
    }

    selectedElements.forEach((id) => {
      const el = allElems.find((e) => e.id === id);
      if (el && el.category !== 'Menú') {
        total += el.price;
      }
    });
    this.finalPrice.set(total);
    return total;
  }
  // ─────────────────────────────────────────────────────
  // GUARDAR EVENTO
  // ─────────────────────────────────────────────────────

  cargarEvento() {
    if (this.eventForm.invalid) return alert('Datos inválidos');

    const user = this.userService.currentUser();
    if (!user?.id) return alert('No se encontró el usuario');

    const rawDate = this.eventForm.get('date')?.value;

    if (!rawDate) return alert('Fecha inválida');

    const formattedDate = new Date(rawDate).toISOString().split('T')[0];

    // VALIDAR CATEGORÍAS OBLIGATORIAS
    for (const cat of this.REQUIRED_CATEGORIES) {
      if (!this.selectedByCategory[cat]) {
        return alert(`Debe seleccionar al menos una opción en la categoría: ${cat}`);
      }
    }

    const newEvent: newEvent = {
      user: user,
      eventType: this.eventForm.value.eventType!,
      guests: this.eventForm.value.guests!,
      date: formattedDate,
      elements: this.eventForm.value.selectedElements!,
      totalPrice: this.finalPrice(),
      status: 'Pendiente',
    };

    this.eventService.post(newEvent).subscribe(() => {
      alert('Evento creado con éxito');
      this.eventForm.reset();
      this.finalPrice.set(0);
    });
  }

  verMas() {
    this.router.navigate(['/user/elementList-Detail']);
  }
}
