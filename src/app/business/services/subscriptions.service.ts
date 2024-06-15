import { Injectable } from '@angular/core';
import {environment} from "../../../environment/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {
  baseUrl = environment.baseUrl;
  constructor(private http:HttpClient) { }

  getSubscriptionById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/suscriptions/${id}`);
  }
  updateSubscription(id: number, subscription: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/suscriptions/${id}`, subscription);
  }
  getSubscriptionByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/suscriptions?userId=${userId}`);
  }
}
