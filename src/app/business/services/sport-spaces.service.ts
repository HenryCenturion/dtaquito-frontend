import { Injectable } from '@angular/core';
import {Observable, switchMap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {SportSpace} from "../models/sport-space.model";
import {environment} from "../../../environment/environment";
import {SubscriptionsService} from "./subscriptions.service";

@Injectable({
  providedIn: 'root'
})
export class SportSpacesService {
  subscriptionId: any;
  baseUrl = environment.baseUrl;
  loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');

  constructor(private http:HttpClient, private subscriptionsService: SubscriptionsService) {
    this.subscriptionsService.getSubscriptionByUserId(this.loggedUser.id).subscribe(subscription => {
      this.subscriptionId = subscription.id;
    });
  }

  getAllSportSpaces(): Observable<SportSpace[]> {
    let loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    if (loggedUser && loggedUser.role === 'P') {
      console.log(loggedUser.id);
      return this.http.get<SportSpace[]>(`${this.baseUrl}/sport-spaces?userId=${loggedUser.id}`);
    } else {
      return this.http.get<SportSpace[]>(this.baseUrl + '/sport-spaces');
    }
  }

  getSportSpaceById(id: number): Observable<SportSpace> {
    return this.http.get<SportSpace>(`${this.baseUrl}/sport-spaces/${id}`);
  }

  createSportSpace(sportSpace: any): Observable<SportSpace> {
    return this.subscriptionsService.getSubscriptionById(this.subscriptionId).pipe(
      switchMap(subscription => {
        if (subscription.plan !== 'premium') {
          alert('Necesitas tener plan premium para agregar espacios de juego');
          throw new Error('Only premium owners can add sport spaces');
        }

        return this.subscriptionsService.getSubscriptionByUserId(this.loggedUser.id);
      }),
      switchMap(subscription => {
        if (this.loggedUser.role === 'P' && subscription.plan === 'premium') {
          sportSpace.userId = this.loggedUser.id;
          return this.http.post<SportSpace>(`${this.baseUrl}/sport-spaces`, sportSpace);
        } else {
          throw new Error('Only premium owners can add sport spaces');
        }
      })
    );
  }

  deleteSportSpace(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/sport-spaces/${id}`);
  }

  updateSportSpace(id: number, sportSpace: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/sport-spaces/${id}`, sportSpace);
  }
}
