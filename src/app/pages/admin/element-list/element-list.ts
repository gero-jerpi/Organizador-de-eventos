import { Component, effect, inject, signal } from '@angular/core';
import { ElementsService } from '../../../services/element-service';
import { Elemento } from '../../../model/elements.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-element-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './element-list.html',
  styleUrl: './element-list.css',
})
export class ElementList {

  private service = inject(ElementsService);
  private router = inject(Router);

  elements = this.service.elements;

  categoryText = signal<string>('');
  filteredElements = signal<Elemento[]>([]);

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
    const all = this.elements();
    this.filteredElements.set(this.applyCategoryFilter(all, this.categoryText()));
  }

  clearFilter() {
    this.categoryText.set('');
    this.filteredElements.set(this.elements());
  }

  delete(id: string){
    if(confirm('¿Seguro desea eliminar el elemento?')){
      this.service.delete(id).subscribe(()=>{
        console.log("Elemento eliminado");
      })
    }
  }

  put(element: Elemento){
    this.service.addElementToUpdate(element);
    this.router.navigate(["/admin/element-form"]);
  }

  addElement(){
    this.service.clearElementToUpdate();
    this.router.navigate(['/admin/element-form']);
  }
}
