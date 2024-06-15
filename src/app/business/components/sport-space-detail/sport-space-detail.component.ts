import {Component, OnInit} from '@angular/core';
import {SportSpacesService} from "../../services/sport-spaces.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {ShortTimePipe} from "../../../shared/pipes/short-time.pipe";
import {ReservationsService} from "../../services/reservations.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Reservation} from "../../models/reservation.model";
import {PaymentsService} from "../../services/payments.service";
import {Payment} from "../../models/payment.model";

@Component({
  selector: 'app-sport-space-detail',
  standalone: true,
  imports: [
    NgIf,
    ShortTimePipe,
    ReactiveFormsModule,
    FormsModule,
    NgForOf
  ],
  templateUrl: './sport-space-detail.component.html',
  styleUrl: './sport-space-detail.component.css'
})
export class SportSpaceDetailComponent implements OnInit{
  loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
  sportSpace: any;
  payments: Payment[] = [];
  selectedPayment: any;
  hours!: number;
  date!: Date;
  message = '';
  showPopup = false;


  constructor(private route: ActivatedRoute, private sportSpacesService: SportSpacesService, private reservationService:ReservationsService, private paymentsService: PaymentsService, private router: Router) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.sportSpacesService.getSportSpaceById(id).subscribe(sportSpace => {
      this.sportSpace = sportSpace;
    });
    this.paymentsService.getPaymentByUserId(this.loggedUser.id).subscribe(payments => {
      this.payments = Array.isArray(payments) ? payments : [payments];
    });
  }

  submitReservation(id: number) {
    const reservation = {
      time: this.date,
      hours: this.hours,
      userId: this.loggedUser.id,
      sportSpacesId: id,
    };
    this.reservationService.createReservation(reservation).subscribe(reservation => {
      this.message = 'Reserva creada con éxito';
      this.showPopup = true;

      setTimeout(() => {
        this.showPopup = false;
        this.router.navigate(['/reservations']);
      }, 1500);
    });
  }

  confirmAndSubmitReservation(id: number, price: number) {
    const confirmation = window.confirm(`Are you sure you want to reserve? The price will be S/ ${price}`);
    if (confirmation) {
      this.submitReservation(id);
    }
  }

  onPaymentMethodChange(event: Event) {
    this.selectedPayment = (event.target as HTMLSelectElement).value;
  }

}
