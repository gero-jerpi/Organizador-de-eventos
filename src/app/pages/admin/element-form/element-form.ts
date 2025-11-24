import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Elemento } from '../../../model/elements.model';
import { ElementsService } from '../../../services/element-service';
import { Router } from '@angular/router';

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
  private router = inject(Router);

  private elementToEdit: Elemento | null = null;
  isEditMode = signal(false);

  /// Form
  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
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
          description:this.elementToEdit.description,
          price: this.elementToEdit.price ?? 0
        })
      }else{
        this.isEditMode.set(false);
     this.form.reset({ name: '', category: '', price: 0 });
      }
    });
  }

  /// Method
  render() {
    if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }
    const newElement = this.form.getRawValue()
    if(this.elementToEdit && this.isEditMode()){
      const updateElement = {...this.elementToEdit, ...newElement}
      this.service.put(updateElement).subscribe(()=>{
        this.service.clearElementToUpdate();
        console.log("Elemento editado");
        this.router.navigate(["/admin/element-list"])

      })
    }else{
      this.service.post(newElement).subscribe(()=>{
        console.log("Elemento agregado");
        this.form.reset();
          this.router.navigate(["/admin/element-list"])
      })
    }
  }
}
