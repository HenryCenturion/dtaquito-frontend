import {Component, OnInit} from '@angular/core';
import {SubscriptionsService} from "../../services/subscriptions.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {PaymentsService} from "../../services/payments.service";
import {Payment} from "../../models/payment.model";

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgClass
  ],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css'
})
export class SubscriptionComponent implements OnInit {
  subscriptionId: any;
  subscription: any;
  payments: Payment[] = [];
  selectedPayment: string | null = null;
  loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
  constructor(private subscriptionsService: SubscriptionsService, private paymentsService: PaymentsService) {
  }

  ngOnInit() {
    this.getSubscription();
    this.getPayments();
  }

  getSubscription() {
    this.subscriptionsService.getSubscriptionByUserId(this.loggedUser.id).subscribe(subscription => {
      this.subscription = subscription;
    });
  }

  getPayments() {
    this.paymentsService.getPaymentByUserId(this.loggedUser.id).subscribe(payments => {
      this.payments = Array.isArray(payments) ? payments : [payments];
      console.log(this.payments);
    });
  }

  onPaymentMethodChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedPayment = selectElement.value;
  }

  upgradeToPremium() {
    if (confirm('Are you sure you want to upgrade to premium?')) {
      this.subscriptionsService.getSubscriptionByUserId(this.loggedUser.id).subscribe(subscription => {
        this.subscriptionId = subscription.id;

        const updatedSubscription = {plan: 'premium', userId: this.loggedUser.id};
        this.subscriptionsService.updateSubscription(this.subscriptionId, updatedSubscription).subscribe(updatedSubscription => {
          if (updatedSubscription.plan === 'premium') {
            this.subscription = updatedSubscription;
          } else {
            alert(updatedSubscription.message);
          }
        });
      });
    }
  }
}
