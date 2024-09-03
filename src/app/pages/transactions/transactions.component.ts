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

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  standalone: true,
  imports: [PageLayoutComponent, NgIf, ProgressBarComponent, CommonModule],
})
export class TransactionsComponent implements OnInit {
  constructor(
    public storeService: StoreService,
    public router: Router,
    public stateService: TransactionService
  ) {
    this.stateService.stateAdd$.subscribe((state) => {
      console.log('StateAdd updated:', state);

      this.stateAdd = state;
    });
  }

  stateAdd = this.stateService.getStateAdd();

  // -------------------------------------------------------------------------------
  // NOTE Init ---------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public ngOnInit(): void {
    setTimeout((_) => {
      this.storeService.isLoading.set(false);
    }, 2000);
  }

  updateName(value: Event): void {
    const input = value.target as HTMLInputElement;
    const nameValue = input.value;

    this.stateService.setStateAdd({ name: nameValue });
  }

  updateAmount(event: Event): void {
    const input = event.target as HTMLInputElement;
    const amountValue = parseFloat(input.value);
    this.stateService.setStateAdd({
      amount: isNaN(amountValue) ? 0 : amountValue,
    });
  }

  updateDate(event: Event): void {
    const input = event.target as HTMLInputElement;
    const dateValue = input.value ? new Date(input.value) : new Date();
    this.stateService.setStateAdd({ date: dateValue });
  }

  clearAmount(): void {
    this.stateService.setStateAdd({ amount: 0 });
  }

  submitTransaction(): void {
    const value = [
      ...transactions,
      {
        id: transactions.length + 1,
        type: 'expense',
        desc: this.stateAdd.name,
        ...this.stateAdd,
      },
    ];

    this.stateService.setStateAdd(initialState)

    console.log(value);

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
