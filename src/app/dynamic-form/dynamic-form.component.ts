import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';

interface StepField {
  name: string;
  label: string;
  type: string;
  validators?: any[];
  options?: { id: number; name: string }[] | null;
}

interface Step {
  title: string;
  fields: StepField[];
  color?: string;
}

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  @Input() moduleName = '';
  @Input() mod_id: any = '';
  @Input() org_id: any = '';

  currentStep = 1;
  steps: Step[] = [];
  form: FormGroup;
  selectedFile: File | null = null;
  private subs: Subscription[] = [];
  completedSteps: boolean[] = [];
  filePreviews: { [key: string]: string } = {};
  insertedRecordId: any = null;
  previewData: any = null;
  errorMessages: { [key: string]: string } = {};

  totalFields = 0;
  formPercentage = 0;
  stepColors = ['#007bff','#28a745','#ffc107'];

isEditMode = false;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    if (this.moduleName === 'Employee') {
      this.steps = [
        {
          title: 'Personal Info',
          fields: [
            { name: 'fullname', label: 'Full Name', type: 'text', validators: [Validators.required] },
            { name: 'email', label: 'Email', type: 'email', validators: [Validators.required, Validators.email] },
            { name: 'phone', label: 'Phone', type: 'text', validators: [Validators.required] }
          ],
          color: '#007bff'
        },
        {
          title: 'Additional Info',
          fields: [
            { name: 'address', label: 'Address', type: 'text', validators: [Validators.required] },
            { name: 'country', label: 'Country', type: 'select', options: [], validators: [Validators.required] },
            { name: 'state', label: 'State', type: 'select', options: [], validators: [Validators.required] },
            { name: 'city', label: 'City', type: 'select', options: [], validators: [Validators.required] },
            { name: 'file', label: 'File', type: 'file', validators: [Validators.required] },
            { name: 'pincode', label: 'Pincode', type: 'text', validators: [Validators.required] }
          ],
          color: '#28a745'
        },
        { title: 'Preview', fields: [], color: '#ffc107' }
      ];
      const savedId = sessionStorage.getItem('insertedRecordId');
    if (savedId) {
      this.insertedRecordId = savedId;
      this.isEditMode = true;
      this.loadSavedData();
    
  }
    }

   
    this.totalFields = this.steps.reduce((acc, step) => acc + step.fields.length, 0);

    this.steps.forEach((step, index) => {
      step.fields.forEach(field => {
        this.form.addControl(field.name, this.fb.control('', field.validators || []));
      });
      this.completedSteps[index] = false;
    });

    this.loadCountries();
    this.setupValueChangeListeners();

    // Update percentage dynamically
    this.form.valueChanges.subscribe(() => this.updatePercentage());
    this.updatePercentage();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private getField(name: string): StepField | undefined {
    return this.steps.flatMap(s => s.fields).find(f => f.name === name);
  }

  loadCountries() {
    this.userService.getCountries().subscribe(res => {
      const countryField = this.getField('country');
      if (countryField) countryField.options = res;
    });
  }

  loadStates(countryId: number) {
    this.userService.getStates(countryId).subscribe(res => {
      const stateField = this.getField('state');
      if (stateField) stateField.options = res;
    });
  }

  loadCities(stateId: number) {
    this.userService.getCities(stateId).subscribe(res => {
      const cityField = this.getField('city');
      if (cityField) cityField.options = res;
    });
  }

  private setupValueChangeListeners() {
    const countryCtrl = this.form.get('country');
    if (countryCtrl) {
      const s = countryCtrl.valueChanges.subscribe(val => {
        const id = Number(val);
        if (!isNaN(id) && id) this.loadStates(id);
        else this.getField('state')!.options = [];
        this.form.patchValue({ state: '', city: '' }, { emitEvent: false });
      });
      this.subs.push(s);
    }

    const stateCtrl = this.form.get('state');
    if (stateCtrl) {
      const s2 = stateCtrl.valueChanges.subscribe(val => {
        const id = Number(val);
        if (!isNaN(id) && id) this.loadCities(id);
        else this.getField('city')!.options = [];
        this.form.patchValue({ city: '' }, { emitEvent: false });
      });
      this.subs.push(s2);
    }
  }

  onFileChange(event: any, fieldName: string) {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.form.patchValue({ [fieldName]: file.name });
      const reader = new FileReader();
      reader.onload = (e: any) => this.filePreviews[fieldName] = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  getFilePreview(fieldName: string): string | null {
    return this.filePreviews[fieldName] || null;
  }

  getOptionName(fieldName: string, value: any): string {
    const field = this.getField(fieldName);
    if (!field || !field.options) return value;
    const opt = field.options.find(o => o.id == value);
    return opt ? opt.name : value;
  }

  getObjectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  isCurrentStepValid(): boolean {
    const step = this.steps[this.currentStep - 1];
    return step.fields.every(f => this.form.get(f.name)?.valid);
  }

  nextStep() {
    const step = this.steps[this.currentStep - 1];
    if (!step) return;

    if (!this.isCurrentStepValid()) {
      alert('Please fill valid data.');
      this.form.markAllAsTouched();
      return;
    }

    if (this.currentStep === 1) {
      this.submitInsert();
    // this.isEditMode ? this.submitUpdate() : this.submitInsert();
  } else if (this.currentStep === 2) {
    this.submitUpdate();
  } else if (this.currentStep === 3) {
    this.loadPreviewData();
  }
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  private submitInsert() {
  const fd = new FormData();

  Object.keys(this.form.controls).forEach(key => {
    let value = this.form.get(key)?.value ?? '';

    // Replace ID with name for select fields
    if (key === 'country' || key === 'state' || key === 'city') {
      value = this.getOptionName(key, value); 
    }

    fd.append(key, value);
  });

  if (this.selectedFile) fd.append('file', this.selectedFile);
  fd.append('mod_id', this.mod_id);
  fd.append('org_id', this.org_id);

  this.userService.insertEmployee(fd).subscribe({
    next: res => {
      if (res.success) {
        this.insertedRecordId = res.insertedId;
         sessionStorage.setItem('insertedRecordId', res.insertedId);
        alert(' inserted successfully!');
        this.currentStep++;
      } else alert(res.message);
    },
    error: err => console.error('Insert error:', err)
  });
}

private submitUpdate() {
  if (!this.insertedRecordId) return;

  const fd = new FormData();

  Object.keys(this.form.controls).forEach(key => {
    let value = this.form.get(key)?.value ?? '';

    if (key === 'country' || key === 'state' || key === 'city') {
      value = this.getOptionName(key, value);
    }

    fd.append(key, value);
  });

  if (this.selectedFile) fd.append('file', this.selectedFile);
  fd.append('id', this.insertedRecordId);

  this.userService.updateEmployee(fd).subscribe({
    next: res => {
      if (res.success) {
        alert(' updated successfully!');
        this.loadPreviewData();
        this.currentStep++;
      } else alert(res.message);
    },
    error: err => console.error('Update error:', err)
  });
}


  private loadPreviewData() {
    if (!this.insertedRecordId) return;

    this.userService.previewEmployees(this.insertedRecordId).subscribe({
      next: res => {
        if (res?.success) {
          this.previewData = res.data;
          if (this.previewData.file) {
           this.previewData.fileUrl = `http://localhost/codelApi/employee/getImage/${this.previewData.file}`;  // ✅ Correct

          }
        } else alert(res.message || 'Preview failed');
      },
      error: err => console.error('Preview error:', err)
    });
  }

  updatePercentage() {
  let filled = 0;
  Object.keys(this.form.controls).forEach(key => {
    const value = this.form.get(key)?.value;
    if (value) filled++;
  });

  const totalFields = this.totalFields;
  this.formPercentage = Math.round((filled / totalFields) * 100);

  // Ensure first step full = at least 33%
  const firstStepFields = this.steps[0].fields.length;
  const firstStepFilled = this.steps[0].fields.filter(f => this.form.get(f.name)?.value).length;
  if (firstStepFilled === firstStepFields) this.formPercentage = Math.max(this.formPercentage, 33);
}
getStepPercentage(stepIndex: number): number {
  const step = this.steps[stepIndex];
  if (!step) return 0;
  const stepFields = step.fields.length;
  const filledFields = step.fields.filter(f => this.form.get(f.name)?.value).length;
  const percentage = Math.round((filledFields / stepFields) * (100 / this.steps.length));
  return percentage;
}
private loadSavedData() {
  if (!this.insertedRecordId) return;

  this.userService.previewEmployees(this.insertedRecordId).subscribe({
    next: res => {
      if (res?.success && res.data) {
        const data = res.data;

        // Patch simple fields
        Object.keys(this.form.controls).forEach(key => {
          if (key !== 'country' && key !== 'state' && key !== 'city') {
            this.form.get(key)?.setValue(data[key]);
          }
        });

        this.userService.getCountries().subscribe(countries => {
          const countryField = this.getField('country');
          if (countryField) {
            countryField.options = countries;

            const countryOption = countries.find((c: any) => c.name === data.country);
            if (countryOption) {
              this.form.get('country')?.setValue(countryOption.id);

              // Manually trigger state options loading
              this.userService.getStates(countryOption.id).subscribe(states => {
                const stateField = this.getField('state');
                if (stateField) stateField.options = states;

                const stateOption = states.find((s: any) => s.name === data.state);
                if (stateOption) {
                  this.form.get('state')?.setValue(stateOption.id);

                  // Manually trigger city options loading
                  this.userService.getCities(stateOption.id).subscribe(cities => {
                    const cityField = this.getField('city');
                    if (cityField) cityField.options = cities;

                    const cityOption = cities.find((c: any) => c.name === data.city);
                    if (cityOption) {
                      this.form.get('city')?.setValue(cityOption.id);
                    }
                  });
                }
              });
            }
          }
        });

        this.previewData = data;
      } else {
        console.warn('No saved data found');
      }
    },
    error: err => console.error('Error loading saved data:', err)
  });
}
}