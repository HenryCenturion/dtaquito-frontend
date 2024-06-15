import {Component, OnInit} from '@angular/core';
import {Payment} from "../../models/payment.model";
import {PaymentsService} from "../../services/payments.service";
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    DatePipe,
    AsyncPipe
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {

  payment: any;
  loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
  errorMessage: string | null = null;
  cardNumberError: string | null = null;
  cvvError: string | null = null;

  constructor(private paymentsService: PaymentsService) {
  }

  ngOnInit(): void {
    this.getPayment();
  }

  getPayment(): void {
    this.paymentsService.getPaymentByUserId(this.loggedUser.id).subscribe((payment: any) => {
      this.payment = payment;
    });
  }
  createPayment(payment: Payment)
{
  if (this.payment) {
    return;
  }

  if (!payment.cardNumber || payment.cardNumber.length !== 16) {
    this.cardNumberError = 'El número de tarjeta debe tener exactamente 16 dígitos.';
  } else {
    this.cardNumberError = null;
  }

  if (!payment.cvv || payment.cvv.length !== 3) {
    this.cvvError = 'El CVV debe tener exactamente 3 dígitos.';
  } else {
    this.cvvError = null;
  }

  if (this.cardNumberError || this.cvvError) {
    return;
  }

  const [year, month] = payment.expirationDate.split('-');
  payment.expirationDate = new Date(Number(year), Number(month) - 1);
  payment.balance = 1000;
  payment.userId = this.loggedUser.id;
  this.paymentsService.createPayment(payment).subscribe(payment => {
    this.payment = payment;
  });
}

  deletePayment(): void {
    if (!this.payment) {
      console.log('No hay método de pago para eliminar.');
      return;
    }

    // Confirmación de la eliminación
    const confirmation = confirm('¿Estás seguro de que quieres eliminar este método de pago?');
    if (!confirmation) {
      return;
    }

    this.paymentsService.deletePayment(this.payment.id).subscribe(
      () => {
        console.log('Método de pago eliminado.');
        this.payment = null;
        this.errorMessage = 'Método de pago eliminado';
      },
      (error: HttpErrorResponse) => {
        this.errorMessage = 'Ocurrió un error al eliminar el método de pago';
      }
    );
  }

  numericOnly(event: any): boolean {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // Carácter no válido, se previene la entrada
      event.preventDefault();
      return false;
    }
    return true;
  }
}
