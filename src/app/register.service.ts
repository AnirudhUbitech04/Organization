
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = 'http://localhost/codeigniter/register'; 

  constructor(private http: HttpClient) {}

  
  register(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      
      console.error('Client-side error:', error.error.message);
    } else {
     
      console.error(`Server returned code ${error.status}, body was:`, error.error);
    }
    return throwError(() => error.error || 'Server error');
  }

   getCountries(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getCountries`)
      .pipe(catchError(this.handleError));
  }

  
  getStates(countryId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getStates/${countryId}`)
      .pipe(catchError(this.handleError));
  }


   
  getCities(stateId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getCities/${stateId}`)
      .pipe(catchError(this.handleError));
  }

  getRegisteredUsers() {
  return this.http.get(`${this.apiUrl}/users`)
    .pipe(catchError(this.handleError));
}


}





