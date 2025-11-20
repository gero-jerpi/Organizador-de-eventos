import { Component, effect, Inject, inject, signal } from '@angular/core';
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
  // ─────────────────────────────────────────────────────
  // SERVICES
  // ─────────────────────────────────────────────────────
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private eventService = inject(EventService);
  private elementService = inject(ElementsService);
  private router = inject(Router);

  finalPrice = signal<number>(0);

  menus = signal<any[]>([]);
  decorations = signal<any[]>([]);
  music = signal<any[]>([]);

  selectedByCategory: { [category: string]: string } = {};

  // ─────────────────────────────────────────────────────
  // CONFIGURACIÓN DE PRECIOS
  // ─────────────────────────────────────────────────────

  readonly EVENT_TYPE_PRICE: Record<string, number> = {
    Cumpleaños: 50000,
    Casamiento: 150000,
    Bautismo: 40000,
    'Fiesta de 15': 120000,
    Aniversario: 60000,
    'Evento corporativo': 200000,
  };

  readonly MENU_PRICE: Record<string, number> = {
    Infantil: 3000,
    Buffet: 3500,
    Gourmet: 8000,
    Vegetariano: 4000,
    Vegano: 4500,
  };

  readonly EXTRAS = [
    { key: 'fotografia', price: 15000 },
    { key: 'barra', price: 20000 },
    { key: 'cotillon', price: 7000 },
    { key: 'mesaDulce', price: 12000 },
    { key: 'animador', price: 18000 },
  ] as const;

  eventTypes = Object.keys(this.EVENT_TYPE_PRICE);

  elements = signal([
    { id: '1', category: 'menu', name: 'A', price: 10000 },
    { id: '2', category: 'menu', name: 'B', price: 15000 },
    { id: '3', category: 'menu', name: 'C', price: 20000 },
    { id: '4', category: 'decoration', name: 'A', price: 8000 },
    { id: '5', category: 'decoration', name: 'B', price: 12000 },
    { id: '6', category: 'decoration', name: 'C', price: 16000 },
    { id: '7', category: 'music', name: 'A', price: 5000 },
    { id: '8', category: 'music', name: 'B', price: 7000 },
    { id: '9', category: 'music', name: 'C', price: 9000 },
  ]);
  // ─────────────────────────────────────────────────────
  // FORM
  // ─────────────────────────────────────────────────────
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
      const elems = this.elements();
      this.menus.set(elems.filter((e) => e.category === 'menu'));
      this.decorations.set(elems.filter((e) => e.category === 'decoration'));
      this.music.set(elems.filter((e) => e.category === 'music'));
    });
  }

  // ─────────────────────────────────────────────────────
  // LÓGICA DE SELECCIÓN
  // ─────────────────────────────────────────────────────

  selectMenu(menuId: string) {
    this.eventForm.patchValue({ menuType: menuId });

    const selected = this.eventForm.value.selectedElements ?? [];
    const filtered = selected.filter((el) => !this.menus().some((m) => m.id === el));

    this.eventForm.patchValue({
      selectedElements: [...filtered, menuId],
    });

    this.calculateTotal();
  }

  selectDecoration(id: string) {
    this.selectedByCategory['decoration'] = id;

    const selected = this.eventForm.value.selectedElements ?? [];
    const filtered = selected.filter((el) => !this.decorations().some((d) => d.id === el));

    this.eventForm.patchValue({
      selectedElements: [...filtered, id],
    });

    this.calculateTotal();
  }

  selectMusic(id: string) {
    this.selectedByCategory['music'] = id;

    const selected = this.eventForm.value.selectedElements ?? [];
    const filtered = selected.filter((el) => !this.music().some((m) => m.id === el));

    this.eventForm.patchValue({
      selectedElements: [...filtered, id],
    });

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

    // 1) Tipo de evento
    if (eventType) {
      total += this.EVENT_TYPE_PRICE[eventType] || 0;
    }

    // 2) Menu por invitado
    if (menuType) {
      total += guests * (this.MENU_PRICE[menuType] || 0);
    }

    // 3) Elementos seleccionados
    const allElems = this.elements();
    selectedElements?.forEach((id) => {
      const el = allElems.find((e) => e.id === id);
      if (el) total += el.price;
    });

    // 4) Extras
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
    if (this.eventForm.invalid) {
      alert('Datos inválidos');
      return;
    }

    const user = this.userService.currentUser();
    if (!user?.id) {
      alert('No se encontró el usuario');
      return;
    }

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
