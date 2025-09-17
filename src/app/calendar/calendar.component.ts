import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../services/calendar.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();
  selectedDate: string | null = null;
  logs: any[] = [];
  calendarDays: any[] = [];
  logDates: string[] = []; 

  todoOpen = false;
  showChart = false;
  todoList: any[] = [];

  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  constructor(private calendarService: CalendarService) {}

  ngOnInit() {
    this.generateCalendar();
    this.fetchAllLogsForMonth();
  }

  generateCalendar() {
    this.calendarDays = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) this.calendarDays.push({ date: null, fullDate: null });
    for (let d = 1; d <= daysInMonth; d++) {
      const fullDate = new Date(this.currentYear, this.currentMonth, d).toISOString().split('T')[0];
      this.calendarDays.push({ date: d, fullDate });
    }
    while (this.calendarDays.length < 42) this.calendarDays.push({ date: null, fullDate: null });
  }

  prevMonth() {
    if (this.currentMonth === 0) { this.currentMonth = 11; this.currentYear--; } 
    else this.currentMonth--;
    this.generateCalendar();
    this.fetchAllLogsForMonth();
  }

  nextMonth() {
    if (this.currentMonth === 11) { this.currentMonth = 0; this.currentYear++; } 
    else this.currentMonth++;
    this.generateCalendar();
    this.fetchAllLogsForMonth();
  }

  fetchAllLogsForMonth() {
    this.logDates = [];
    const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = new Date(this.currentYear, this.currentMonth, d).toISOString().split('T')[0];
      this.calendarService.getLogs(dateStr).subscribe((logs: any[]) => {
        if (logs.length > 0 && !this.logDates.includes(dateStr)) this.logDates.push(dateStr);
      });
    }
  }

  selectDate(date: string) {
    if (!date) return;
    if (this.selectedDate === date) { this.selectedDate = null; this.logs = []; return; }
    this.selectedDate = date;

    this.calendarService.getLogs(date).subscribe((existingLogs: any[]) => {
      if (existingLogs.length === 0) {
        this.calendarService.saveLog({ created_date: date }).subscribe(() => {
          this.calendarService.getLogs(date).subscribe((data: any[]) => {
            this.logs = data;
            this.logDates.push(date);
          });
        });
      } else this.logs = existingLogs;
    });
  }

  isToday(date: string) {
    const today = new Date().toISOString().split('T')[0];
    return date === today;
  }

  hasLog(date: string) {
    return this.logDates.includes(date);
  }

  openTodoList() {
    this.todoOpen = true;
    this.showChart = false;
    this.fetchTodoList();
  }

  openChartPage() {
    this.showChart = true;
    this.todoOpen = false;
  }

  fetchTodoList() {
    this.calendarService.getTodos().subscribe((data: any[]) => {
      this.todoList = data;
    });
  }
}
