import { Component, inject } from '@angular/core';
import { ElementsService } from '../../../services/element-service';
import { Elemento } from '../../../model/elements.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-element-list',
  imports: [],
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
  delete(id: number){
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


}
