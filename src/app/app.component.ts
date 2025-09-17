import { Component,HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'new_task';

    @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: Event) {
    if (localStorage.getItem('token')) {
      event.preventDefault();
      (event as BeforeUnloadEvent).returnValue = 'You must log out before closing!';
    }
  }
}
