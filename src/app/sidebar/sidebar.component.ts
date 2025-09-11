import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from '../user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  users: User[] = [];
  selectedModule: string = '';
  selectedModuleId: string = ''; 
  selectedOrgId: string = '';
  status: string = '';
  loggedInUser: any = null;  // Store full user data

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    
    const userData = sessionStorage.getItem('user');
    if (!userData) {
      this.router.navigate(['/login']);
      return;
    }

    
    this.loggedInUser = JSON.parse(userData);

    // Fetch modules or users if needed
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  selectModule(moduleName: string, mod_id: any, org_id: any, status: any) {
    this.selectedModule = moduleName;
    this.selectedModuleId = mod_id;
    this.selectedOrgId = org_id;
    this.status = status;

    console.log('Selected Module ID:', this.selectedModuleId);
    console.log('Selected Org ID:', this.selectedOrgId);
    console.log('Status:', this.status);
  }

  logout() {
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
