import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { transactions } from 'src/app/example/transactions';

interface AddState {
  desc: string;
  amount: number;
  date: any;
  type: string;
}

export const initialState: AddState = {
  desc: '',
  amount: 0,
  date: new Date(),
  type: 'expense'
};

@Injectable({
  providedIn: 'root',  // This makes the service available application-wide
})
export class TransactionService {
  public transactions = transactions
  private initialState: AddState = {
    type: 'expense', // default value
    date: moment().format('DD-MMM-YYYY'), // default value, current date
    desc: '',
    amount: 0
  };

  // Initial states with appropriate data types
  private _stateAdd = new BehaviorSubject<AddState>(initialState);
  private _stateTransactions = new BehaviorSubject<any>(transactions);

  // Expose observables to allow components to subscribe to state changes
  stateAdd$ = this._stateAdd.asObservable();
  stateTransactions$ = this._stateTransactions.asObservable();

  constructor() {}

  // Method to update the state partially or fully
  setStateAdd(updatedValues: Partial<AddState>): void {
    const currentState = this._stateAdd.value;
    const newState = { ...currentState, ...updatedValues };
    this._stateAdd.next(newState);
  }

  resetStateAdd(): void {
    this._stateAdd.next(this.initialState);
  }

  // Method to get the current state
  getStateAdd(): AddState {
    return this._stateAdd.value;
  }

  // Method to get the current state
  getStateTransactions(): any {
    return this._stateTransactions.value;
  }

  setLatestTransactions(updatedState: AddState): any {
    const currentState = this._stateTransactions.value;
    const newState = [ ...currentState, updatedState ];

    console.log(newState);

    this._stateTransactions.next(newState);
  }
}
