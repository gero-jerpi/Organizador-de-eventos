import { Injectable, signal } from '@angular/core';
import { NewUser, User } from '../model/user.model';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  private apiUrlUser = 'http://localhost:3000/users';

  private userSignal = signal<User[]>([]);
  public users = this.userSignal.asReadonly();

  //sesion actual
  private currentUserSignal = signal<User|null>(null);
  public currentUser = this.currentUserSignal.asReadonly();

  constructor(private http: HttpClient){
    this.get();
    const saved = localStorage.getItem('currentUser');
    if(saved) this.currentUserSignal.set(JSON.parse(saved))
  }

  //obtener la lista
  get() {
    this.http.get<User[]>(this.apiUrlUser).subscribe((data) => {
      this.userSignal.set(data);
    });
  }
  
  //Regster(post)

  register(newUser: NewUser): Observable<User> {
  return this.http.get<User[]>(`${this.apiUrlUser}?email=${newUser.email}`).pipe(
    switchMap(usersFound => {
      if (usersFound.length > 0) {
        return throwError(() => new Error("El email ya está registrado"));
      }

      return this.http.post<User>(this.apiUrlUser, newUser).pipe(
        tap(userCreated => {
          this.userSignal.update(users => [...users, userCreated]);
          this.currentUserSignal.set(userCreated);
          localStorage.setItem('currentUser', JSON.stringify(userCreated));
        })
      );
    })
  );
}

  //login(get + validacion)

    login(email: string, password: string):Observable<User> {
    return this.http.get<User[]>(`${this.apiUrlUser}?email=${email}`).pipe(
      switchMap((result) => {
        if (result.length === 0) {
           throw new Error("Correo o contraseña incorrectos");
        }

        const user = result[0];

        if (user.password !== password) {
           throw new Error("Correo o contraseña incorrectos");
        }

        // guardar sesión
        this.currentUserSignal.set(user);
        localStorage.setItem('currentUser', JSON.stringify(user));

         return of (user);
      }),
        catchError(() => {
          return throwError(() => new Error("Correo o contraseña incorrectos"));
        })
    );
  }

  //LOGOUT
  logout(){
    this.currentUserSignal.set(null);
    localStorage.removeItem('currentUser');
  }

  
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrlUser}/${id}`).pipe(
      tap(() =>
        this.userSignal.update((users) =>
          users.filter((u) => u.id !== id)
        )
      )
    );
  }

  update(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrlUser}/${user.id}`, user).pipe(
      tap((updated) =>
        this.userSignal.update((users) =>
          users.map((u) => (u.id === updated.id ? updated : u))
        )
      )
    );
  }

}
