import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface AddState {
  name: string;
  amount: number;
  date: Date;
}

export const initialState: AddState = {
  name: '',
  amount: 0,
  date: new Date(),
};

@Injectable({
    providedIn: 'root',  // This makes the service available application-wide
})
export class TransactionService {
  // Initial states with appropriate data types
  private _stateAdd = new BehaviorSubject<AddState>(initialState);

  // Expose observables to allow components to subscribe to state changes
  stateAdd$ = this._stateAdd.asObservable();

  constructor() {}

  // Method to update the state partially or fully
  setStateAdd(updatedValues: Partial<AddState>): void {
    const currentState = this._stateAdd.value;
    const newState = { ...currentState, ...updatedValues };
    this._stateAdd.next(newState);
  }

  // Method to get the current state
  getStateAdd(): AddState {
    return this._stateAdd.value;
  }
}
