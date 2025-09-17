import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  formData = {
    org_name: '',
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    const today = new Date();
    const day = today.getDay();
    const date = today.getDate(); 
    
    if (day === 0) {
      alert('Today is Sunday, login is not allowed!');
      return;
    }


    if (day === 6) {
     
      const weekOfMonth = Math.ceil(date / 7);
      if (weekOfMonth === 1 || weekOfMonth === 3) {
        alert('Login is not allowed on 1st and 3rd Saturday!');
        return;
      }
    }

    this.authService.login(this.formData).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.authService.saveSession(res.token, res.user);
          this.router.navigate(['/dashboard']);
        } else {
          alert('Login failed: ' + res.message);
        }
      },
      error: (err) => {
        alert(err.error?.message || 'Login failed');
      }
    });
  }
}
