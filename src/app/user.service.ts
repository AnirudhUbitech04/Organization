import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define User interface (adjust fields as per your DB table)
export interface User {
 mod_id: number;
  module_name: string;
  status: number;
  org_id: number;
  status_name: string;
  created_at: string;
 

 
  id: number;
  name: string;
  email: string;
  
  organization: string;
  
}



@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost/codelApi/api/modules'; 
   private baseUrl = 'http://localhost/codeigniter4/api';
   private submitUrl = 'http://localhost/codelApi/employee';


  constructor(private http: HttpClient) { }

  // Fetch all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);

  }
login(data: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, data);
  }
getCountries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/countries`);
  }

  getStates(countryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/states/${countryId}`);
  }

  getCities(stateId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/cities/${stateId}`);

}

insertEmployee(formData: FormData): Observable<any> {
    return this.http.post(`${this.submitUrl}/insert`, formData);
  }

  // Update existing employee
  updateEmployee(formData: FormData): Observable<any> {
    return this.http.post(`${this.submitUrl}/update`, formData);
  }

  // Preview (Fetch all employee data)
  previewEmployees(id: any): Observable<any> {
    return this.http.get<any>(`${this.submitUrl}/preview/${id}`);
}







}