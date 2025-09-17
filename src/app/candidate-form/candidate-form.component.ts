
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CandidateService } from '../../services/candidate.service';
// import { ChartOptions, ChartData } from 'chart.js';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-candidate-form',
//   templateUrl: './candidate-form.component.html',
//   styleUrls: ['./candidate-form.component.css']
// })
// export class CandidateFormComponent implements OnInit {

//   step: number = 1;
//   personalForm!: FormGroup;
//   detailsForm!: FormGroup;
//   reviewData: any = {};
//   countries: any[] = [];
//   states: any[] = [];
//   cities: any[] = [];
//   selectedFile: File | null = null;
//   imagePreview: string | ArrayBuffer | null = null;
//   candidateId: number | null = null;

//   orgId: number = Number(localStorage.getItem('org_id')) || 1;

//   public pieChartOptions: ChartOptions<'doughnut'> = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: { legend: { display: false } }
//   };
//   public pieChartType: 'doughnut' = 'doughnut';
//   public pieChartData: ChartData<'doughnut'> = {
//     labels: ['Completed', 'Remaining'],
//     datasets: [{
//       data: [0, 100],
//       backgroundColor: ['#007bff', '#e9ecef'],
//       borderWidth: 1
//     }]
//   };

//   constructor(
//     private fb: FormBuilder,
//     private service: CandidateService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.initForms();
//     this.loadCountries();
//     this.restoreFormData();
//     this.loadLastCandidate();

//     this.personalForm.valueChanges.subscribe(() => this.updatePieChart());
//     this.detailsForm.valueChanges.subscribe(() => this.updatePieChart());

//     this.updatePieChart();
//   }

//   initForms(): void {
//     this.personalForm = this.fb.group({
//       full_name: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       phone: ['', [Validators.required, Validators.minLength(10)]]
//     });

//     this.detailsForm = this.fb.group({
//       address: ['', Validators.required],
//       country_id: ['', Validators.required],
//       state_id: ['', Validators.required],
//       city_id: ['', Validators.required],
//       pincode: ['', [Validators.required, Validators.minLength(6)]],
//       profile_image: [null, Validators.required]
//     });
//   }

//   loadLastCandidate(): void {
//     if (!this.candidateId) {
//       this.service.getLastCandidate(this.orgId).subscribe(res => {
//         const candidate = res?.candidate;
//         if (candidate) {
//           this.candidateId = candidate.id;
//           this.personalForm.patchValue(candidate);
//           this.detailsForm.patchValue(candidate);

//           this.step = candidate.address ? 3 : 2;
//           this.updatePieChart();
//         }
//       });
//     }
//   }

//   updatePieChart(): void {
//     const allControls = { ...this.personalForm.controls, ...this.detailsForm.controls };
//     const total = Object.keys(allControls).length;
//     const filled = Object.values(allControls).filter(ctrl => !!ctrl.value && ctrl.valid).length;
//     const percent = Math.round((filled / total) * 100);

//     const color = percent < 50
//       ? `rgb(255, ${Math.round(percent * 5)}, 0)`
//       : `rgb(${Math.round(255 - (percent - 50) * 5)}, 255, 0)`;

//     this.pieChartData = {
//       ...this.pieChartData,
//       datasets: [{
//         ...this.pieChartData.datasets[0],
//         data: [percent, 100 - percent],
//         backgroundColor: [color, '#e9ecef']
//       }]
//     };
//   }

//   saveFormData(): void {
//     const data = {
//       step: this.step,
//       personalForm: this.personalForm.value,
//       detailsForm: this.detailsForm.value,
//       reviewData: this.reviewData,
//       imagePreview: this.imagePreview,
//       candidateId: this.candidateId
//     };
//     localStorage.setItem('candidateForm', JSON.stringify(data));
//   }

//   restoreFormData(): void {
//     const saved = localStorage.getItem('candidateForm');
//     if (saved) {
//       const parsed = JSON.parse(saved);
//       this.step = parsed.step || 1;
//       this.candidateId = parsed.candidateId || null;
//       this.personalForm.patchValue(parsed.personalForm || {});
//       this.detailsForm.patchValue(parsed.detailsForm || {});
//       this.reviewData = parsed.reviewData || {};
//       this.imagePreview = parsed.imagePreview || null;
//     }
//   }

//   clearFormData(): void {
//     localStorage.removeItem('candidateForm');
//     this.candidateId = null;
//   }

//   loadCountries(): void {
//     this.service.getCountries().subscribe(res => this.countries = res);
//   }

//   onCountryChange(event: Event): void {
//     const id = (event.target as HTMLSelectElement).value;
//     this.states = [];
//     this.cities = [];
//     this.detailsForm.patchValue({ state_id: '', city_id: '' });

//     this.service.getStates(id).subscribe(res => this.states = res);
//   }

//   onStateChange(event: Event): void {
//     const id = (event.target as HTMLSelectElement).value;
//     this.cities = [];
//     this.detailsForm.patchValue({ city_id: '' });

//     this.service.getCities(id).subscribe(res => this.cities = res);
//   }

//   onFileChange(event: any): void {
//     const file = event.target.files[0];
//     this.selectedFile = file;
//     this.detailsForm.patchValue({ profile_image: file });

//     const reader = new FileReader();
//     reader.onload = () => {
//       this.imagePreview = reader.result;
//       this.saveFormData();
//       this.updatePieChart();
//     };
//     reader.readAsDataURL(file);
//   }

//   nextStep(): void {
//     if (this.step === 1 && this.personalForm.valid) {
//       const payload = {
//         ...this.personalForm.value,
//         candidate_id: this.candidateId,
//         org_id: this.orgId
//       };

//       this.service.saveCandidateStep1(payload).subscribe(res => {
//         this.candidateId = res.candidate_id;
//         this.reviewData = { ...this.personalForm.value };
//         this.step = 2;
//         this.saveFormData();
//         this.updatePieChart();
//       });

//     } else if (this.step === 2 && this.detailsForm.valid && this.candidateId) {
//       const formData = new FormData();

//       const detailValues = this.detailsForm.value;
//       Object.entries(detailValues).forEach(([key, value]) => {
//         if (key !== 'profile_image') formData.append(key, value);
//       });

//       if (this.selectedFile) {
//         formData.append('profile_image', this.selectedFile);
//       }

//       formData.append('org_id', this.orgId.toString());

//       this.service.updateCandidateStep2(this.candidateId, formData).subscribe(() => {
//         const selectedCountry = this.countries.find(c => c.id == detailValues.country_id);
//         const selectedState = this.states.find(s => s.id == detailValues.state_id);
//         const selectedCity = this.cities.find(c => c.id == detailValues.city_id);

//         this.reviewData = {
//           ...this.reviewData,
//           ...detailValues,
//           country_name: selectedCountry?.country_name,
//           state_name: selectedState?.state_name,
//           city_name: selectedCity?.city_name
//         };

//         this.step = 3;
//         this.saveFormData();
//         this.updatePieChart();
//       });
//     }
//   }

//   prevStep(): void {
//     if (this.step > 1) {
//       this.step--;
//       this.saveFormData();
//       this.updatePieChart();
//     }
//   }

//   submitForm(): void {
//     alert('Candidate Saved Successfully!');
//     this.step = 1;
//     this.personalForm.reset();
//     this.detailsForm.reset();
//     this.reviewData = {};
//     this.imagePreview = null;
//     this.selectedFile = null;
//     this.clearFormData();
//     this.updatePieChart();
//   }
// }




import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CandidateService } from '../services/candidate.service';
import { ChartOptions, ChartData } from 'chart.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-candidate-form',
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.css']
})
export class CandidateFormComponent implements OnInit {

  step = 1;
  personalForm!: FormGroup;
  detailsForm!: FormGroup;
  reviewData: any = {};
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  candidateId: number | null = null;

  orgId: number = Number(localStorage.getItem('org_id')) || 1;

  public pieChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  };
  public pieChartType: 'doughnut' = 'doughnut';
  public pieChartData: ChartData<'doughnut'> = {
    labels: ['Completed', 'Remaining'],
    datasets: [{ data: [0, 100], backgroundColor: ['#007bff', '#e9ecef'], borderWidth: 1 }]
  };

  constructor(private fb: FormBuilder, private service: CandidateService, private router: Router) {}

  ngOnInit(): void {
    this.personalForm = this.fb.group({
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.detailsForm = this.fb.group({
      address: ['', Validators.required],
      country_id: ['', Validators.required],
      state_id: ['', Validators.required],
      city_id: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.minLength(6)]],
      profile_image: [null, Validators.required]
    });

    this.loadCountries();
    this.restoreFormData();

    if (!this.candidateId) {
      this.service.getLastCandidate(this.orgId).subscribe(res => {
        if (res.candidate) {
          this.candidateId = res.candidate.id;
          this.personalForm.patchValue(res.candidate);
          this.detailsForm.patchValue(res.candidate);
          this.step = res.candidate.address ? 3 : 2; 
          this.updatePieChart();
        }
      });
    }

    this.personalForm.valueChanges.subscribe(() => this.updatePieChart());
    this.detailsForm.valueChanges.subscribe(() => this.updatePieChart());

    this.updatePieChart();
  }

  updatePieChart() {
    const allControls = { ...this.personalForm.controls, ...this.detailsForm.controls };
    const total = Object.keys(allControls).length;
    const filled = Object.keys(allControls).filter(
      key => !!allControls[key].value && allControls[key].valid
    ).length;
    const percent = Math.round((filled / total) * 100);

    let color = '';
    if (percent < 50) color = `rgb(${255}, ${Math.round(percent * 5)}, 0)`; 
    else color = `rgb(${Math.round(255 - (percent - 50) * 5)}, 255, 0)`; 

    this.pieChartData = {
      ...this.pieChartData,
      datasets: [
        {
          ...this.pieChartData.datasets[0],
          data: [percent, 100 - percent],
          backgroundColor: [color, '#e9ecef']
        }
      ]
    };
  }

  saveFormData() {
    const data = {
      step: this.step,
      personalForm: this.personalForm.value,
      detailsForm: this.detailsForm.value,
      reviewData: this.reviewData,
      imagePreview: this.imagePreview,
      candidateId: this.candidateId
    };
    localStorage.setItem('candidateForm', JSON.stringify(data));
  }

  restoreFormData() {
    const saved = localStorage.getItem('candidateForm');
    if (saved) {
      const parsed = JSON.parse(saved);
      this.step = parsed.step || 1;
      this.candidateId = parsed.candidateId || null;
      if (parsed.personalForm) this.personalForm.patchValue(parsed.personalForm);
      if (parsed.detailsForm) this.detailsForm.patchValue(parsed.detailsForm);
      if (parsed.reviewData) this.reviewData = parsed.reviewData;
      if (parsed.imagePreview) this.imagePreview = parsed.imagePreview;
      this.updatePieChart();
    }
  }

  clearFormData() {
    localStorage.removeItem('candidateForm');
    this.candidateId = null;
  }

  loadCountries() {
    this.service.getCountries().subscribe(res => this.countries = res);
  }

  onCountryChange(event: any) {
    const id = event.target.value;
    this.states = [];
    this.cities = [];
    this.detailsForm.patchValue({ state_id: '', city_id: '' });
    this.service.getStates(id).subscribe(res => this.states = res);
  }

  onStateChange(event: any) {
    const id = event.target.value;
    this.cities = [];
    this.detailsForm.patchValue({ city_id: '' });
    this.service.getCities(id).subscribe(res => this.cities = res);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file;
    this.detailsForm.patchValue({ profile_image: file });

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
      this.saveFormData();
      this.updatePieChart();
    };
    reader.readAsDataURL(file);
  }

  nextStep() {
    if (this.step === 1 && this.personalForm.valid) {
      const payload = { 
        ...this.personalForm.value, 
        candidate_id: this.candidateId, 
        org_id: this.orgId   
      };
      this.service.saveCandidateStep1(payload).subscribe(res => {
        this.candidateId = res.candidate_id;
        this.reviewData = { ...this.personalForm.value };
        this.step = 2;
        this.saveFormData();
        this.updatePieChart();
      });
    } else if (this.step === 2 && this.detailsForm.valid && this.candidateId) {
      const formData = new FormData();
      Object.keys(this.detailsForm.value).forEach(key => formData.append(key, this.detailsForm.value[key]));
      if (this.selectedFile) formData.append('profile_image', this.selectedFile);

      formData.append('org_id', this.orgId.toString()); 

      this.service.updateCandidateStep2(this.candidateId, formData).subscribe(() => {
        const selectedCountry = this.countries.find(c => c.id == this.detailsForm.value.country_id);
        const selectedState = this.states.find(s => s.id == this.detailsForm.value.state_id);
        const selectedCity = this.cities.find(c => c.id == this.detailsForm.value.city_id);

        this.reviewData = { 
          ...this.reviewData, 
          ...this.detailsForm.value,
          country_name: selectedCountry?.country_name,
          state_name: selectedState?.state_name,
          city_name: selectedCity?.city_name
        };
        this.step = 3;
        this.updatePieChart(); 
        this.saveFormData();
      });
    }
  }

  prevStep() {
    this.step--;
    this.saveFormData();
    this.updatePieChart();
  }

  submitForm() {
    alert('Candidate Saved Successfully!');
    this.step = 1;
    this.personalForm.reset();
    this.detailsForm.reset();
    this.reviewData = {};
    this.imagePreview = null;
    this.selectedFile = null;
    this.clearFormData();
    this.updatePieChart();
  }
}
