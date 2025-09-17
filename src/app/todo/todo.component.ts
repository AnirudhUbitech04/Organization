import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarService } from '../services/calendar.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  @Input() todoList: any[] = [];
  @Output() backToCalendar = new EventEmitter<void>();
  @Output() openNavbar = new EventEmitter<void>();

  newTask = { name: '', start_time: '', end_time: '', status: 'pending' };

  constructor(private calendarService: CalendarService) {}

  ngOnInit() {}

  addTask() {
    if (!this.newTask.name || !this.newTask.start_time || !this.newTask.end_time) return;
    this.calendarService.saveTodo(this.newTask).subscribe(() => {
      this.fetchTodoList();
      this.newTask = { name: '', start_time: '', end_time: '', status: 'pending' };
    });
  }

  updateTaskStatus(task: any) {
    this.calendarService.updateTodo(task).subscribe(() => this.fetchTodoList());
  }

  fetchTodoList() {
    this.calendarService.getTodos().subscribe((data: any[]) => this.todoList = data);
  }

  goBack() {
    this.backToCalendar.emit();
  }

  goToChart() {
    this.openNavbar.emit();
  }
}
