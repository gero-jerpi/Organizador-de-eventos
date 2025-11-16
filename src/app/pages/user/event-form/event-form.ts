import { Elemento } from './../../../model/elements.model';
import { Component, effect, inject } from '@angular/core';
import { EventService } from '../../../services/event-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ElementsService } from '../../../services/element-service';

@Component({
  selector: 'app-event-form',
  imports: [ReactiveFormsModule],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
})
export class EventForm {
  private fb = inject(FormBuilder);

  private elementService = inject(ElementsService)
  elements = this.elementService.elements;

  getCategories(){
    return [...new Set(this.elements().map(e => e.category))];
  }

  form = this.fb.nonNullable.group({

  })

  verValor(id: any){
    console.log(id);
  }


  filterByCategory(category: string){
    return this.elements().filter(e => e.category === category)
  }



}
