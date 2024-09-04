// Angular modules
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { StoreService } from '@services/store.service';
import { initialState, TransactionService } from '@services/transaction.service';

// Components
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';
import { transactions } from 'src/app/example/transactions';
import * as moment from 'moment';
import { formatMoney, parseMoney } from '@helpers/moneyFormatter.helper';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  standalone: true,
  imports: [PageLayoutComponent, NgIf, ProgressBarComponent, CommonModule],
})

export class TransactionsComponent implements OnInit {
  public transactions = transactions;
  public moment = moment;

  public stateAdd = this.stateService.getStateAdd();
  public stateTransaction = this.stateService.getStateTransactions();

  constructor(
    public storeService: StoreService,
    public router: Router,
    public stateService: TransactionService
  ) {
    this.stateService.stateAdd$.subscribe((state) => {
      this.stateAdd = state;
    });

    this.stateService.stateTransactions$.subscribe((state) => {
      this.stateTransaction = state;
    });
  }
  // -------------------------------------------------------------------------------
  // NOTE Init ---------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public ngOnInit(): void {
    setTimeout((_) => {
      this.storeService.isLoading.set(false);
    }, 2000);
  }

  updateName(event: Event): void {
    this.stateAdd.desc = (event.target as HTMLInputElement).value;
  }

  updateType(selectedtype: string): void {
    this.stateAdd.type = selectedtype;
  }

  updateAmount(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.stateAdd.amount = parseMoney(input.value);
  }

  updateDate(event: Event): void {
    this.stateAdd.date = new Date((event.target as HTMLInputElement).value);
  }

  clearAmount(): void {
    this.stateAdd.amount = 0;
  }

  getFormattedAmount(): string {
    return formatMoney(this.stateAdd.amount);
  }

  submitTransaction(): void {
    const newTransaction = {
      id: this.stateTransaction.length + 1,
      type: this.stateAdd.type,
      date: this.stateAdd.date ?? new Date(),
      desc: this.stateAdd.desc,
      amount: this.stateAdd.amount,
    };

    this.stateService.setLatestTransactions(newTransaction)
    this.stateService.resetStateAdd();
    this.router.navigate(['home']);
  }
  // -------------------------------------------------------------------------------
  // NOTE Actions ------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Computed props -----------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Helpers ------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Requests -----------------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Subscriptions ------------------------------------------------------------
  // -------------------------------------------------------------------------------
}
