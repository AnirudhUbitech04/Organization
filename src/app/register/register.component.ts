
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RegisterService } from '../register.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  imageFile: File | null = null;
  imageError = '';
  backendErrors: { [key: string]: string } = {};

  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];

  users: any[] = [];
  showUsers = false;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService
  ) {
    this.registerForm = this.fb.group({
      name: [''],
      email: [''],
      password: [''],
      phone: [''],
      country_id: [''],
      state_id: [''],
      city_id: [''],
      image: ['']
    });
  }


  

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries(): void {
    this.registerService.getCountries().subscribe(res => {
      this.countries = res.data || res;
    });
  }

  onCountryChange(event: any): void {
    const countryId = event.target.value;
    this.registerService.getStates(countryId).subscribe(res => {
      this.states = res.data || res;
      this.cities = [];
      this.registerForm.patchValue({ state_id: '', city_id: '' });
    });
  }

  onStateChange(event: any): void {
    const stateId = event.target.value;
    this.registerService.getCities(stateId).subscribe(res => {
      this.cities = res.data || res;
      this.registerForm.patchValue({ city_id: '' });
    });
  }

  onFileChange(event: any): void {
    this.imageError = '';
    this.backendErrors['image'] = '';

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imageFile = file;
    }
  }

  onSubmit(): void {
    this.backendErrors = {};
    this.imageError = '';

    if (!this.imageFile) {
      this.imageError = '';
      return;
    }

    const formData = new FormData();


    for (const key in this.registerForm.value) {
      if (key !== 'image') {
        let value = this.registerForm.get(key)?.value;
        let backendKey = key;
        if (key === 'country_id') backendKey = 'country';
        else if (key === 'state_id') backendKey = 'state';
        else if (key === 'city_id') backendKey = 'city';

        formData.append(backendKey, value);
      }
    }

    formData.append('image', this.imageFile as Blob);

    this.registerService.register(formData).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.registerForm.reset();
        this.imageFile = null;
        this.states = [];
        this.cities = [];
        this.getUsers(); 
      },
      error: (err) => {
        if (err.status === 422 && err.error.errors) {
          this.backendErrors = err.error.errors;
          if (this.backendErrors['image']) {
            this.imageError = this.backendErrors['image'];
          }
          
        } else {
          alert(err.error?.message || 'Registration failed.');
        }
      }
      
      
    });
  }

  getError(field: string): string | null {
  const fieldMap: Record<string, string> = {
    country_id: 'country',
    state_id: 'state',
    city_id: 'city',
  };
  const backendField = fieldMap[field] || field;
  return this.backendErrors[backendField] || null;
}


  
  getUsers(): void {
    this.registerService.getRegisteredUsers().subscribe({
      next: (res: any) => {
        this.users = res.data || [];
        this.showUsers = true;
      },
      error: () => {
        alert('Failed to fetch users');
      }
    });
  }
}



// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import { RegisterService } from '../register.service';

// @Component({
//   selector: 'app-register',
//   templateUrl: './register.component.html',
// })
// export class RegisterComponent implements OnInit {
//   registerForm: FormGroup;
//   imageFile: File | null = null;
//   imageError = '';
//   backendErrors: { [key: string]: string } = {};

//   countries: any[] = [];
//   states: any[] = [];
//   cities: any[] = [];

//   users: any[] = []; 
//   showUsers = false; 

//   constructor(
//     private fb: FormBuilder,
//     private registerService: RegisterService
//   ) {
//     this.registerForm = this.fb.group({
//       name: [''],
//       email: [''],
//       password: [''],
//       phone: [''],
//       country_id: [''],
//       state_id: [''],
//       city_id: [''],
//       image: ['']
//     });
//   }

//   ngOnInit(): void {
//     this.loadCountries();
//   }

//   loadCountries(): void {
//     this.registerService.getCountries().subscribe(res => {
//       this.countries = res.data || res;
//     });
//   }

//   onCountryChange(event: any): void {
//     const countryId = event.target.value;
//     this.registerService.getStates(countryId).subscribe(res => {
//       this.states = res.data || res;
//       this.cities = [];
//       this.registerForm.patchValue({ state_id: '', city_id: '' });
//     });
//   }

//   onStateChange(event: any): void {
//     const stateId = event.target.value;
//     this.registerService.getCities(stateId).subscribe(res => {
//       this.cities = res.data || res;
//       this.registerForm.patchValue({ city_id: '' });
//     });
//   }

//   onFileChange(event: any): void {
//     this.imageError = '';
//     this.backendErrors['image'] = '';

//     if (event.target.files.length > 0) {
//       const file = event.target.files[0];
//       this.imageFile = file;
//     }
//   }

//   onSubmit(): void {
//     this.backendErrors = {};
//     this.imageError = '';

//     if (!this.imageFile) {
//       this.imageError = 'Please upload an image.';
//       return;
//     }

//     const formData = new FormData();
//     for (const key in this.registerForm.value) {
//       if (key !== 'image') {
//         let value = this.registerForm.get(key)?.value;

//         let backendKey = key;
//         if (key === 'country_id') backendKey = 'country';
//         else if (key === 'state_id') backendKey = 'state';
//         else if (key === 'city_id') backendKey = 'city';

//         formData.append(backendKey, value);
//       }
//     }

//     formData.append('image', this.imageFile as Blob);

//     this.registerService.register(formData).subscribe({
//       next: (res: any) => {
//         alert(res.message);
//         this.registerForm.reset();
//         this.imageFile = null;
//         this.states = [];
//         this.cities = [];
//         this.getUsers(); //  Refresh list after register
//       },
//       error: (err) => {
//         if (err.status === 422 && err.error.errors) {
//           this.backendErrors = err.error.errors;
//           if (this.backendErrors['image']) {
//             this.imageError = this.backendErrors['image'];
//           }
//         } else {
//           alert(err.error?.message || 'Registration failed.');
//         }
//       }
//     });
//   }

//   getError(field: string): string | null {
//     return this.backendErrors[field] || null;
//   }

//   // Fetch users from backend
//   getUsers(): void {
//     this.registerService.getRegisteredUsers().subscribe({
//       next: (res: any) => {
//         this.users = res.data || [];
//         this.showUsers = true;
//       },
//       error: () => {
//         alert('Failed to fetch users');
//       }
//     });
//   }
// }



