import { Component, Input, OnChanges } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-content-navbar',
  templateUrl: './content-navbar.component.html',
  styleUrls: ['./content-navbar.component.css'] 
})
export class ContentNavbarComponent implements OnChanges {
  @Input() todoList: any[] = [];

  filteredList: any[] = [];

  chartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }]
  };
  chartType: ChartType = 'pie';

  activeFilter: 'pending' | 'complete' | 'overdue' | 'all' = 'all';

  ngOnChanges() {
    this.updateChart('all');
    this.filterTasks('all');
  }

  updateChart(type: 'pending' | 'complete' | 'overdue' | 'all') {
    const total = this.todoList.length || 1;
    const pending = this.todoList.filter(t => t.status === 'pending').length;
    const complete = this.todoList.filter(t => t.status === 'complete').length;
    const overdue = this.todoList.filter(t => t.status === 'overdue').length;

    this.activeFilter = type;
    this.filterTasks(type);

    if (type === 'pending') {
      this.chartData = {
        labels: ['Pending %'],
        datasets: [{ data: [Math.round((pending / total) * 100)], backgroundColor: ['#f0ad4e'] }]
      };
    } else if (type === 'complete') {
      this.chartData = {
        labels: ['Complete %'],
        datasets: [{ data: [Math.round((complete / total) * 100)], backgroundColor: ['#5cb85c'] }]
      };
    } else if (type === 'overdue') {
      this.chartData = {
        labels: ['Overdue %'],
        datasets: [{ data: [Math.round((overdue / total) * 100)], backgroundColor: ['#d9534f'] }]
      };
    } else {
      this.chartData = {
        labels: ['Pending', 'Complete', 'Overdue'],
        datasets: [
          {
            data: [
              Math.round((pending / total) * 100),
              Math.round((complete / total) * 100),
              Math.round((overdue / total) * 100)
            ],
            backgroundColor: ['#f0ad4e', '#5cb85c', '#d9534f']
          }
        ]
      };
    }
  }

  filterTasks(type: 'pending' | 'complete' | 'overdue' | 'all') {
    if (type === 'all') {
      this.filteredList = [...this.todoList];
    } else {
      this.filteredList = this.todoList.filter(t => t.status === type);
    }
  }
  
}
