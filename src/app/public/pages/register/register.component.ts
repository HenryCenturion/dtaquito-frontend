import { Component } from '@angular/core';
import {AuthService} from "../../../shared/services/auth.service";
import {Router} from "@angular/router";
import {AbstractControl, FormControl, FormsModule, ValidationErrors, Validators} from "@angular/forms";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  role: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    const emailControl = new FormControl(this.email, [Validators.required, this.emailFormatValidator]);
    if (emailControl.invalid) {
      alert('Por favor, introduce un correo electrónico válido.');
      return;
    }

    const newUser = {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    };

    this.authService.register(newUser).subscribe(
      response => {
        alert('Usuario registrado con éxito');
        this.router.navigate(['/login']);
      },
      error => {
        alert('Hubo un error al registrar el usuario');
      }
    );
  }

  emailFormatValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const emailPattern = /^[a-z0-9]+@[a-z0-9]+\.[a-z]+$/i;
    const match = emailPattern.test(value);
    return match ? null : {emailFormat: true};
  }
}
