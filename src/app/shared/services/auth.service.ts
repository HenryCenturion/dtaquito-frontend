import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {BehaviorSubject, catchError, Observable, switchMap, tap, throwError} from "rxjs";
import {environment} from "../../../environment/environment";
import {UsersService} from "../../business/services/users.service";
import {SubscriptionsService} from "../../business/services/subscriptions.service";
import {User} from "../../business/models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.baseUrl;
  private authUrl = this.baseUrl + '/users';
  private isLoggedIn = new BehaviorSubject<boolean>(this.checkLoginStatus());

  constructor(private http: HttpClient, private router: Router, private userService: UsersService, private subscriptionService: SubscriptionsService) { }

login(email: string, password: string): Observable<User> {
  return this.http.get<User>(`${this.authUrl}?email=${email}&password=${password}`).pipe(
    tap(user => {
      if (user) {
        localStorage.setItem('loggedUser', JSON.stringify(user));
        this.isLoggedIn.next(true);
        this.router.navigate(['/home']);
      }
    }),
    catchError(error => {
      return throwError('Usuario o contraseña incorrectos');
    })
  );
}

  logout() {
    localStorage.removeItem('loggedUser');
    this.isLoggedIn.next(false);
    this.router.navigate(['/home']);
  }

  checkLoginStatus(): boolean {
    return localStorage.getItem('loggedUser') !== null;
  }

  get isLoggedIn$() {
    return this.isLoggedIn.asObservable();
  }


  register(user: any): Observable<any> {
    return this.userService.createUser(user);
  }

  getLoggedUser(): User | null {
    const user = localStorage.getItem('loggedUser');
    return user ? JSON.parse(user) : null;
  }
}
