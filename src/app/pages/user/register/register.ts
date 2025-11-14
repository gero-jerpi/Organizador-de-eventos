import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user-service';
import { Router } from '@angular/router';
import { NewUser, User } from '../../../model/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
 private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  errorMsg = '';

  registroForm = this.fb.group({
  name: ['', Validators.required],
  lastName: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  phone: ['', Validators.required],
  password: ['', [Validators.required, Validators.minLength(5)]],
  role: ['client', Validators.required]
  });


  registrar() {
    if (this.registroForm.invalid) {
      this.errorMsg = "Por favor complete todos los campos correctamente.";
      return;
    }

    const newUser: NewUser = this.registroForm.value as NewUser;

    this.userService.register(newUser).subscribe({
      next: () => {
        alert('Registro exitoso!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMsg = err.message;
      }
    });
  }
}

