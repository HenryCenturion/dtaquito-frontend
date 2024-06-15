import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../../shared/services/auth.service";
import {RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(
      success => {},
      error => {
        this.errorMessage = 'Invalid email or password. Please try again.';
      }
    );
  }
}
