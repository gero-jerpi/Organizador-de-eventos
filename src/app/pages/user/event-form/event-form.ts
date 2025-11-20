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
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

type ExtraName = 'fotografia' | 'barra' | 'cotillon' | 'mesaDulce' | 'animador';

@Component({
  selector: 'app-event-form',
  imports: [ReactiveFormsModule, CommonModule, RouterModule,MatDatepickerModule,MatNativeDateModule,MatInputModule,MatFormFieldModule,],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
})
export class EventForm {
<<<<<<< Updated upstream
=======

  // Fechas ya ocupadas (ejemplo — después las pedís del backend)
fechasOcupadas: Date[] = [

];

fechaDeshabilitada = (date: Date | null): boolean => {
  console.log("Filtro ejecutado → ", date);
  return false;
};



  // ─────────────────────────────────────────────────────
  // SERVICES
  // ─────────────────────────────────────────────────────
>>>>>>> Stashed changes
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
    date: [null, Validators.required],
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
      this.decorations.set(elems.filter((e) => e.category === 'decoration'));
      this.music.set(elems.filter((e) => e.category === 'music'));
    });
  }

  // ─────────────────────────────────────────────────────
  // SELECCIÓN DE ELEMENTOS
  // ─────────────────────────────────────────────────────

  selectMenu(menuId: string) {
    this.eventForm.patchValue({ menuType: menuId });
    const selected = this.eventForm.value.selectedElements ?? [];
    const filtered = selected.filter((el) => !this.menus().some((m) => m.id === el));
    this.eventForm.patchValue({ selectedElements: [...filtered, menuId] });
    this.calculateTotal();
  }

  selectDecoration(id: string) {
    this.selectedByCategory['decoration'] = id;
    const selected = this.eventForm.value.selectedElements ?? [];
    const filtered = selected.filter((el) => !this.decorations().some((d) => d.id === el));
    this.eventForm.patchValue({ selectedElements: [...filtered, id] });
    this.calculateTotal();
  }

  selectMusic(id: string) {
    this.selectedByCategory['music'] = id;
    const selected = this.eventForm.value.selectedElements ?? [];
    const filtered = selected.filter((el) => !this.music().some((m) => m.id === el));
    this.eventForm.patchValue({ selectedElements: [...filtered, id] });
    this.calculateTotal();
  }

  toggleExtra(extra: ExtraName, value: boolean) {
    const extras = this.eventForm.get('extras') as FormGroup;
    extras.get(extra)?.setValue(value);
    this.calculateTotal();
  }

  // ─────────────────────────────────────────────────────
  // CÁLCULO TOTAL
  // ─────────────────────────────────────────────────────

  calculateTotal(): number {
    const raw = this.eventForm.getRawValue();
    const guests = raw.guests ?? 0;
    const eventType = raw.eventType ?? '';
    const menuType = raw.menuType ?? '';
    const selectedElements = raw.selectedElements ?? [];
    const extras = raw.extras ?? {};

    let total = 0;

    if (eventType) total += this.EVENT_TYPE_PRICE[eventType] || 0;

    const allElems = this.elements();
    selectedElements.forEach((id) => {
      const el = allElems.find((e) => e.id === id);
      if (el) total += el.price;
    });

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
      status: 'pending',
    };

    this.eventService.post(newEvent).subscribe(() => {
      alert('Evento creado con éxito');
      this.eventForm.reset();
      this.finalPrice.set(0);
    });
  }


}
