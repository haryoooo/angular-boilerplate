// Angular modules
import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';

// Services
import { StoreService } from '@services/store.service';
import {
  OptionsDropdown,
  TransactionService,
} from '@services/transaction.service';
import { FirebaseService } from '@services/firebase.service';

// Components
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';
import Chart from 'chart.js/auto'; // Import Chart.js
import { formatMoney } from '@helpers/moneyFormatter.helper';
import * as moment from 'moment';

const initialStateOptions = [
  { name: 'Expense', code: 'exp' },
  { name: 'Income', code: 'inc' },
];

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  standalone: true,
  imports: [
    PageLayoutComponent,
    NgIf,
    NgFor,
    NgClass,
    ProgressBarComponent,
    FormsModule,
    DropdownModule,
    SelectButtonModule,
  ],
})
export class ChartComponent implements OnInit, AfterViewInit {
  lineChart: any;
  options: OptionsDropdown[] | undefined;
  // stateOptions: any[] = [
  //   { value: 1, label: 'Jan' },
  //   { value: 2, label: 'Feb' },
  //   { value: 3, label: 'Mar' },
  //   { value: 4, label: 'Apr' },
  //   { value: 5, label: 'May' },
  //   { value: 6, label: 'Jun' },
  //   { value: 7, label: 'Jul' },
  //   { value: 8, label: 'Aug' },
  //   { value: 9, label: 'Sept' },
  //   { value: 10, label: 'Oct' },
  //   { value: 11, label: 'Nov' },
  //   { value: 12, label: 'Dec' },
  // ];

  // value: string = 'off';

  selectedOptions = this.stateService.getStateDropdown();
  transactions = this.stateService.getStateTransactions();
  allTransactions: any[] = [];
  amountTransactions: number = 0;

  moment = moment;

  // Use ViewChild to grab the canvas element
  @ViewChild('lineCanvas') private lineCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    public storeService: StoreService,
    public stateService: TransactionService,
    public firebaseService: FirebaseService
  ) {
    this.stateService.stateOptions$.subscribe((state) => {
      this.selectedOptions = state;

      this.getAllTransactions(state?.name);
      this.createLineChart();
    });
  }

  ngOnInit(): void {
    this.listDropdown();

    // Simulate loading
    setTimeout(() => {
      this.storeService.isLoading.set(false);
    }, 2000);
  }

  ngAfterViewInit(): void {
    this.waitForCanvas();
  }

  // -------------------------------------------------------------------------------
  // NOTE Actions ------------------------------------------------------------------
  // -------------------------------------------------------------------------------
  async getAllTransactions(option: string | undefined) {
    try {
      let transactions = await this.firebaseService.getCollectionData('budget');
      const selectedOpts = option?.toLowerCase();

      transactions?.sort((a, b) => a['id'] - b['id']);

      const payload = transactions?.filter((el) => el['type'] === selectedOpts);

      this.allTransactions = option ? payload : transactions;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // This method waits until the canvas element is available
  private waitForCanvas(): void {
    if (this.lineCanvas && this.lineCanvas.nativeElement) {
      this.createLineChart();
    } else {
      console.warn('lineCanvas not available, retrying...');
      setTimeout(() => {
        this.waitForCanvas(); // Retry until available
      }, 100); // Retry after 100ms
    }
  }

  private listDropdown(): void {
    this.options = initialStateOptions;
  }

  public handleSetOptions(updateValue: any) {
    this.stateService.setStateDropdown(updateValue?.value);
  }

  public getFormattedAmount(amount: number): string {
    return formatMoney(amount);
  }

  private createLineChart() {
    const option = this.selectedOptions;
    const allTransactions = this.stateService.getStateTransactions();

    const filterTransactions = allTransactions?.filter(
      (el: any) => el?.type === option?.name?.toLowerCase()
    );

    const countAmount = filterTransactions?.reduce(
      (acc: any, el: any) => acc + el?.amount,
      0
    );

    console.log(allTransactions, option);
    // console.log(countAmount, 'amount');

    const labels = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ];

    const currentMonthNumber = moment().month(); // Returns the current month as a number (1-12)

    const subsetData = [65, 59, 80, 81, 56, 55, 40, 50, 75, 100, 35, 40];

    const subsetFilteredData = subsetData?.map((el, index) => {
      if (index === currentMonthNumber) {
        return countAmount;
      }

      return el;
    });

    if (this.lineCanvas && this.lineCanvas.nativeElement) {
      this.lineChart = new Chart(this.lineCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              data: subsetFilteredData,
              borderColor: '#29756f',
              backgroundColor: 'rgba(75,192,192,0.2)',
              fill: true,
              tension: 0.4,
              borderCapStyle: 'round',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                padding: 10,
              },
              border: {
                display: false, // Hide x-axis line
              },
            },
            y: {
              grid: {
                display: false,
              },
              ticks: {
                display: false,
              },
              border: {
                display: false, // Hide y-axis line
              },
              beginAtZero: true, // Start y-axis from zero
            },
          },
          elements: {
            line: {
              borderWidth: 2,
              tension: 0.4,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    } else {
      console.error('Failed to create chart, canvas not available');
    }
  }
}
