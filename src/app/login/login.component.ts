import { Component } from '@angular/core';
import { Router } from '@angular/router';   
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  message: string = '';
  

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    const today = new Date();
  const day = today.getDay(); 
  const date = today.getDate();    
  const month = today.getMonth(); 
  const year = today.getFullYear();

  if (day === 0) { 
    alert("Today is Sunday..");
    return;
  }
   if (day === 6) {
   
    const saturdayCount = Math.floor((date + (new Date(year, month, 1).getDay() - 6 + 7) % 7 - 1) / 7) + 1;
    if (saturdayCount === 1) {
      alert("Today is the 1st Saturday of the month. Login not possible.");
      return;
    }
    if (saturdayCount === 3) {
      alert("Today is the 3rd Saturday of the month. Login not possible.");
      return;
    }
  }

    this.userService.login(this.loginForm.value).subscribe({
      next: (res) => {
        if (res.success) {
          console.log('User:', res.user);
          sessionStorage.setItem('user', JSON.stringify(res.user));
          this.message = res.message;
          this.router.navigate(['/sidebar']);
        } else {
          this.message = res.message;
        }
      },
      error: (err) => {
        this.message = err.error.message || 'Login failed';
      }
    });
  }

    
  }

