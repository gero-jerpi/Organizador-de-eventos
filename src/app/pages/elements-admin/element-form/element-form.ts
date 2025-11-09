import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Elemento } from '../../../model/elements.model';
import { ElementsService } from '../../../services/elements-service';

@Component({
  selector: 'app-element-form',
  imports: [ReactiveFormsModule],
  templateUrl: './element-form.html',
  styleUrl: './element-form.css',
})
export class ElementForm {
  /// Variables
  private fb = inject(FormBuilder);
  private service = inject(ElementsService);

  private elementToEdit: Elemento | null = null;
  isEditMode = signal(false);

  /// Form
  /// Agregar validaciones
  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    price: [0, Validators.required],
  });

  /// Constructor
  constructor() {
    effect(() => {
      this.elementToEdit = this.service.elementToUpdate();
      if(this.elementToEdit){
        this.isEditMode.set(true);
        this.form.patchValue({
          name: this.elementToEdit.name,
          category: this.elementToEdit.category,
          price: this.elementToEdit.price
        })
      }else{
        this.isEditMode.set(false);
        this.form.reset();
      }
    });
  }

  /// Method
  render() {
    const newElement = this.form.getRawValue()
    if(this.elementToEdit && this.isEditMode()){
      const updateElement = {...this.elementToEdit, ...newElement}
      this.service.put(updateElement).subscribe(()=>{
        this.service.clearElementToUpdate();
        console.log("Elemento editado");
      })
    }else{
      this.service.post(newElement).subscribe(()=>{
        console.log("Elemento agregado");
        this.form.reset();
      })
    }
  }
}
