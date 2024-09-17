// Angular modules
import { NgFor, NgIf, NgClass, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

// Services
import { TransactionService } from '@services/transaction.service';
import { StoreService } from '@services/store.service';

// Components
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';
import { transactions } from 'src/app/example/transactions';

import * as moment from 'moment';
import { formatMoney } from '@helpers/moneyFormatter.helper';
import { FirebaseService } from '@services/firebase.service';
import { calculateTransaction } from '@helpers/transactionSum.helper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [PageLayoutComponent, NgIf, ProgressBarComponent, NgFor, NgClass],
})
export class HomeComponent implements OnInit {
  public transactions = this.stateService.getStateTransactions();
  public allTransactions: any[] = [];
  public moment = moment;

  constructor(
    public storeService: StoreService,
    public stateService: TransactionService,
    public firebaseService: FirebaseService
  ) {}
  // -------------------------------------------------------------------------------
  // NOTE Init ---------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public ngOnInit(): void {
    this.getAllTransactions();
    
    setTimeout((_) => {
      this.storeService.isLoading.set(false);
    }, 2000);
  }

  async getAllTransactions() {
    try {
      let transactions = await this.firebaseService.getCollectionData('budget');

      transactions.sort((a, b) => a['id'] - b['id']);

      this.allTransactions = transactions;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  getFormattedAmount(amount: number): string {
    return formatMoney(amount);
  }

  calculateTransactions(type: string) {
    const result = calculateTransaction(this.allTransactions, type)

    return formatMoney(result)
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
