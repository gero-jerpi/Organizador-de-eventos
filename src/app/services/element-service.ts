import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Elemento, newElement } from '../model/elements.model';

@Injectable({
  providedIn: 'root',
})
export class ElementsService {

  //// Api
  private apiUrl = 'http://localhost:3000/elements';

  /// Variables
  private elementsSignal = signal<Elemento[]>([]);
  public elements = this.elementsSignal.asReadonly();

  /// Variables && methods to update
  private elementToUpdateSignal = signal<Elemento | null>(null);
  public elementToUpdate = this.elementToUpdateSignal.asReadonly();

  addElementToUpdate(element: Elemento){
    this.elementToUpdateSignal.set(element);
  }

  clearElementToUpdate(){
    this.elementToUpdateSignal.set(null);
  }


  /// Constructor
  constructor(private http: HttpClient){
    this.get();
  }

  /// Methods
  get(){
    this.http.get<Elemento[]>(this.apiUrl).subscribe((data)=>{
      this.elementsSignal.set(data);
      console.log("Elementos cargados");
    })
  }

  post(newElement: newElement): Observable<Elemento>{
    return this.http.post<Elemento>(this.apiUrl, newElement).pipe(
      tap(elementCreated=>
        this.elementsSignal.update(elements =>
          [...elements, elementCreated]
        )
      )
    )
  }

  delete(id: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(()=>
        this.elementsSignal.update(elements =>
          elements.filter(element =>
            element.id !== id
          )
        )
      )
    )
  }

  put(elementToUpdate: Elemento): Observable<Elemento>{
    return this.http.put<Elemento>(`${this.apiUrl}/${elementToUpdate.id}`, elementToUpdate).pipe(
      tap(elementUpdated =>
        this.elementsSignal.update(elements =>
          elements.map(element =>
            element.id === elementUpdated.id ? elementUpdated : element
          )
        )
      )
    )
  }


}
