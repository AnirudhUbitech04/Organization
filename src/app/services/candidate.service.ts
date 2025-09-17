
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  private baseUrl = 'http://localhost/codeigniter/api';
 

  constructor(private http: HttpClient) {}


  getCountries(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getCountries`);
  }

  getStates(countryId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getStates/${countryId}`);
  }

  getCities(stateId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getCities/${stateId}`);
  }

  saveCandidateStep1(data: any): Observable<any> {
 
    return this.http.post(`${this.baseUrl}/saveCandidateStep1`, data);
  }

  updateCandidateStep2(id: number, data: FormData): Observable<any> {
  
    return this.http.post(`${this.baseUrl}/updateCandidateStep2/${id}`, data);
  }


  getLastCandidate(orgId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getLastCandidate/${orgId}`);
  }

  getModules(orgId: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/getModules/${orgId}`);
}


  activateModule(orgId: number, modId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/activateModule/${orgId}/${modId}`, {});
  }
}
