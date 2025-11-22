import { Component, effect, inject, signal } from '@angular/core';
import { EventService } from '../../../services/event-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ElementsService } from '../../../services/element-service';
import { UserService } from '../../../services/user-service';
import { Router, RouterModule } from '@angular/router';
import { newEvent } from '../../../model/event.model';
import { CommonModule } from '@angular/common';

type ExtraName = 'fotografia' | 'barra' | 'cotillon' | 'mesaDulce' | 'animador';

@Component({
  selector: 'app-event-form',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
})
export class EventForm {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private eventService = inject(EventService);
  private elementService = inject(ElementsService);

  finalPrice = signal<number>(0);

  menus = signal<any[]>([]);
  decorations = signal<any[]>([]);
  music = signal<any[]>([]);

  elements = signal<any[]>([]);

  selectedByCategory: { [category: string]: string } = {};
  selectedMenu: any = null;
  foodTotal: number = 0;

  readonly EVENT_TYPE_PRICE: Record<string, number> = {
    Cumpleaños: 50000,
    Casamiento: 150000,
    Bautismo: 40000,
    'Fiesta de 15': 120000,
    Aniversario: 60000,
    'Evento corporativo': 200000,
  };

  readonly EXTRAS = [
    { key: 'fotografia', price: 15000 },
    { key: 'barra', price: 20000 },
    { key: 'cotillon', price: 7000 },
    { key: 'mesaDulce', price: 12000 },
    { key: 'animador', price: 18000 },
  ] as const;

  eventTypes = Object.keys(this.EVENT_TYPE_PRICE);

  eventForm = this.fb.group({
    date: ['', Validators.required],
    guests: [0, Validators.required],
    eventType: ['', Validators.required],
    menuType: ['', Validators.required],
    selectedElements: this.fb.control<string[]>([]),
    extras: this.fb.group({
      fotografia: false,
      barra: false,
      cotillon: false,
      mesaDulce: false,
      animador: false,
    }),
  });

  constructor() {
    effect(() => {
      const elems = this.elementService.elements();
      if (!elems) return;

      this.elements.set(elems);

      // Filtrar por categoría
      this.menus.set(elems.filter((e) => e.category === 'menu'));
      this.decorations.set(elems.filter((e) => e.category === 'decoracion'));
      this.music.set(elems.filter((e) => e.category === 'musica'));
    });
    this.eventForm.get('guests')?.valueChanges.subscribe(() => {
      this.calculateTotal();
    });

    this.eventForm.get('eventType')?.valueChanges.subscribe(() => {
      this.calculateTotal();
    });

    this.eventForm.get('extras')?.valueChanges.subscribe(() => {
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

  toggleExtra(extra: ExtraName, value: boolean) {
    const extras = this.eventForm.get('extras') as FormGroup;
    extras.get(extra)?.setValue(value);
    this.calculateTotal();
  }

  selectOption(category: string, id: string) {
  const current = this.selectedByCategory[category];
  if (current === id) {
     const prevEl = this.elements().find((e: any) => e.id === current);
     if (prevEl) {
      this.finalPrice.update((p) => p - prevEl.price);
    }
    delete this.selectedByCategory[category];

    if (category === 'menu') {
      this.eventForm.controls.menuType.setValue('');
    }
   } else {
     this.calculateValues(id, category);

     if (category === 'menu') {
      this.eventForm.controls.menuType.setValue(this.selectedByCategory['menu'] || '');
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

    if (category === 'menu') {
      this.eventForm.patchValue({ menuType: id });
    }

    this.calculateTotal();
  }

  calculateTotal(): number {
    const raw = this.eventForm.getRawValue();
    const guests = raw.guests ?? 0;
    const eventType = raw.eventType ?? '';
    const selectedElements = raw.selectedElements ?? [];
    const extras = raw.extras ?? {};

    let total = 0;

    // Precio del tipo de evento
    if (eventType) {
      total += this.EVENT_TYPE_PRICE[eventType] || 0;
    }

    const allElems = this.elements();

    // Encontrar menú seleccionado
    let selectedMenu: any = null;
    selectedElements.forEach((id) => {
      const el = allElems.find((e) => e.id === id);
      if (el && el.category === 'menu') {
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
      if (el && el.category !== 'menu') {
        total += el.price;
      }
    });

    // Sumar extras
    this.EXTRAS.forEach((extra) => {
      if (extras?.[extra.key]) total += extra.price;
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

    const newEvent: newEvent = {
      userId: user.id.toString(),
      date: this.eventForm.value.date!,
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
}
