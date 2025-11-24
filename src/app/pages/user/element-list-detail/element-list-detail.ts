import { Component, computed, effect, inject, signal } from '@angular/core';
import { ElementsService } from '../../../services/element-service';
import { Elemento } from '../../../model/elements.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-element-list-detail',
  imports: [CommonModule,],
  templateUrl: './element-list-detail.html',
  styleUrl: './element-list-detail.css',
})
export class ElementListDetail {

  private service = inject(ElementsService);
  private router = inject(Router);

  elements = this.service.elements;

  categoryText = signal<string>('');
  filteredElements = signal<Elemento[]>([]);
  activeFilter = signal('all');

  constructor() {
    // inicializar
    this.filteredElements.set(this.elements());

    effect(() => {
      const all = this.elements();
      const term = this.categoryText();
      this.filteredElements.set(this.applyCategoryFilter(all, term));
    });
  }

  // normaliza texto: reemplaza NBSP, colapsa espacios, quita acentos y baja a minúsculas
  private normalize(text: string): string {
    if (!text) return '';
    return text
      .replace(/\u00A0/g, ' ')   // NBSP -> espacio
      .replace(/\s+/g, ' ')      // múltiples espacios -> uno
      .trim()
      .normalize('NFKD')         // descomponer acentos
      .replace(/[\u0300-\u036f]/g, '') // eliminar marcas diacríticas
      .normalize('NFKC')
      .toLowerCase();
  }

  private applyCategoryFilter(items: Elemento[] = [], rawTerm: string): Elemento[] {
    const term = this.normalize(rawTerm);
    if (!term) return items ?? [];
    return (items ?? []).filter(el => {
      const cat = this.normalize(el?.category ?? '');
      return cat.includes(term);
    });
  }

  filterByCategory() {
  this.activeFilter.set(this.categoryText()); // ← marcar categoría seleccionada

  const all = this.elements();
  this.filteredElements.set(
    this.applyCategoryFilter(all, this.categoryText())
  );
}


  clearFilter() {
  this.activeFilter.set('all');   // ← marcar botón Mostrar todos
  this.categoryText.set('');
  this.filteredElements.set(this.elements());
}

  categories = computed(() => {
  const items = this.elements() ?? [];
  const set = new Set<string>();

  items.forEach(el => {
    if (el.category) {
      set.add(el.category.trim());
    }
  });

  return Array.from(set).sort();
});

filterByCategoryButton(category: string) {
  this.categoryText.set(category);
}


}
