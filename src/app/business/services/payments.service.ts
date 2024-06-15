import { Injectable } from '@angular/core';
import {environment} from "../../../environment/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  baseUrl = environment.baseUrl;
  constructor(private http:HttpClient) { }

  createPayment(payment: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/payments`, payment);
  }

  getAllPayments(): Observable<any> {
    return this.http.get(`${this.baseUrl}/payments`);
  }

  getPaymentByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/payments?userId=${userId}`);
  }

  deletePayment(paymentId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/payments/${paymentId}`);
  }
}
