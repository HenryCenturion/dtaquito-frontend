import { Injectable } from '@angular/core';
import {environment} from "../../../environment/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SportSpace} from "../models/sport-space.model";
import {Reservation} from "../models/reservation.model";

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {
  baseUrl = environment.baseUrl;
  constructor(private http:HttpClient) { }

  getReservationById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/reservations/${id}`);
  }

  getAllReservations(): Observable<Reservation[]> {
    let loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    return this.http.get<Reservation[]>(`${this.baseUrl}/reservations?userId=${loggedUser.id}`);
  }

  createReservation(reservation: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reservations`, reservation);
  }

  deleteReservation(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/reservations/${id}`);
  }
}
