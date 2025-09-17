import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeComponent } from './employee/employee.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AuthGuard } from './auth.guard';
import { CandidateFormComponent } from './components/candidate-form/candidate-form.component';
import { RegisterComponent } from './register/register.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'employee', component: CandidateFormComponent },
      { path: 'timesheet', component: TimesheetComponent },
      { path: 'calendar', component: CalendarComponent } 
    ]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: '**', redirectTo: '/login' } ,
  {path:'register', component: RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
