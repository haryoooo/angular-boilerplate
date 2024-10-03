// Angular modules
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

// Services
import { StoreService } from '@services/store.service';
import { TransactionService } from '@services/transaction.service';
import { FirebaseService } from '@services/firebase.service';

// Components
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';
import Chart from 'chart.js/auto'; // Import Chart.js
import { formatMoney } from '@helpers/moneyFormatter.helper';
import * as moment from 'moment';

interface City {
  name: string;
  code: string;
}

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
  ],
})
export class ChartComponent implements OnInit, AfterViewInit {
  lineChart: any;
  cities: City[] | undefined;

  selectedCity: City | undefined;

  transactions = this.stateService.getStateTransactions();
  allTransactions: any[] = [];
  moment = moment;

  // Use ViewChild to grab the canvas element
  @ViewChild('lineCanvas') private lineCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    public storeService: StoreService,
    public stateService: TransactionService,
    public firebaseService: FirebaseService
  ) {}

  ngOnInit(): void {
    this.getAllTransactions();
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
  async getAllTransactions() {
    try {
      let transactions = await this.firebaseService.getCollectionData('budget');

      transactions.sort((a, b) => a['id'] - b['id']);

      this.allTransactions = transactions;
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

  public listDropdown(): void {
    this.cities = [
      { name: 'Expense', code: 'exp' },
      { name: 'Income', code: 'inc' },
    ];
  }

  public getFormattedAmount(amount: number): string {
    return formatMoney(amount);
  }

  private createLineChart() {
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

    const subsetData = [65, 59, 80, 81, 56, 55, 40, 50, 75, 80, 35, 40];

    if (this.lineCanvas && this.lineCanvas.nativeElement) {
      this.lineChart = new Chart(this.lineCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              // label: 'Series A',
              data: subsetData,
              borderColor: 'rgba(75,192,192,1)',
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
              min: Math.min(...[65, 59, 80, 81, 56, 55, 40]) - 5, // Dynamic minimum with padding
              max: Math.max(...[65, 59, 80, 81, 56, 55, 40]) + 5, // Dynamic maximum with padding
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
