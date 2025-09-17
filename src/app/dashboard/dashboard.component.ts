import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../services/candidate.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  modules: any[] = [];
  orgId: number = 0;
  isLoggedIn: boolean = false;
  user: any = null;

  constructor(
    private service: CandidateService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.orgId = this.user.org_id || this.user.id || 1;
    }

    if (this.orgId) this.loadModules();
  }

  loadModules() {
    this.service.getModules(this.orgId).subscribe(res => {
      this.modules = res;
    });
  }

  onModuleClick(mod: any) {
    this.service.activateModule(this.orgId, mod.mod_id).subscribe(() => {
      this.loadModules();
      
      if (mod.mod_name.toLowerCase() === 'employee') {
        this.router.navigate(['dashboard/employee']);
      } else if (mod.mod_name.toLowerCase() === 'timesheet') {
        this.router.navigate(['dashboard/timesheet']);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
  }
}
