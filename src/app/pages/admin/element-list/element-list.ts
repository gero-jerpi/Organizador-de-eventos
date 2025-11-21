import { Component, inject } from '@angular/core';
import { ElementsService } from '../../../services/element-service';
import { Elemento } from '../../../model/elements.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-element-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './element-list.html',
  styleUrl: './element-list.css',
})
export class ElementList {

  /// Variables
  private service = inject(ElementsService);
  private router = inject(Router);

  /// Get data
  elements = this.service.elements;

  /// Methods
  delete(id: string){
    if(confirm('¿Seguro desea eliminar el elemento?')){
      this.service.delete(id).subscribe(()=>{
        /// Posible modificacion
        console.log("Elemento eliminado");
      })
    }
  }

  put(element: Elemento){
    this.service.addElementToUpdate(element);
    this.router.navigate(["/admin/element-form"])
  }

  addElement(){
    this.service.clearElementToUpdate();
    this.router.navigate(['/admin/element-form'])
  }

}