import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private baseUrl = 'http://localhost/codeigniter/calendar';

  
  constructor(private http: HttpClient) {}

 private getAuthHeaders(): HttpHeaders {
  const token = localStorage.getItem('token');
  return new HttpHeaders({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  });
}


  getTodos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/todos`, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  saveTodo(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/todos/insert`, data, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  updateTodo(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/todos/update/${data.id}`, data, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  getLogs(date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/logs/${date}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  saveLog(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/logs/insert`, data, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }
  
}


// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class CalendarService {
//   private baseUrl = 'http://localhost/codeigniter/calendar';

//   constructor(private http: HttpClient) {}


//   private getAuthHeaders(): HttpHeaders {
//     const token = localStorage.getItem('token');
//     return new HttpHeaders({
//       'Content-Type': 'application/json',
//       ...(token ? { Authorization: `Bearer ${token}` } : {})
//     });
//   }

 
//   getTodos(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.baseUrl}/todos`, {
//       headers: this.getAuthHeaders()
//     });
//   }

//   saveTodo(data: any): Observable<any> {
//     return this.http.post(`${this.baseUrl}/todos/insert`, data, {
//       headers: this.getAuthHeaders()
//     });
//   }

//   updateTodo(data: any): Observable<any> {
//     return this.http.put(`${this.baseUrl}/todos/update/${data.id}`, data, {
//       headers: this.getAuthHeaders()
//     });
//   }
// 1
//   getLogs(date: string): Observable<any[]> {
//     return this.http.get<any[]>(`${this.baseUrl}/logs/${date}`, {
//       headers: this.getAuthHeaders()
//     });
//   }

 
//   saveLog(data: any): Observable<any> {
//     return this.http.post(`${this.baseUrl}/logs/insert`, data, {
//       headers: this.getAuthHeaders()
//     });
//   }
// }







// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class CalendarService {
//   private baseUrl = 'http://localhost/codeigniter/calendar';

//   constructor(private http: HttpClient) {}


//   private getAuthHeaders(): HttpHeaders {
//     const token = localStorage.getItem('token');
//     return new HttpHeaders({
//       'Content-Type': 'application/json',
//       ...(token ? { Authorization: `Bearer ${token}` } : {})
//     });
//   }

 
//   getTodos(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.baseUrl}/todos`, {
//       headers: this.getAuthHeaders(),
//       withCredentials: true
//     });
//   }

//   saveTodo(data: any): Observable<any> {
//     return this.http.post(`${this.baseUrl}/todos/insert`, data, {
//       headers: this.getAuthHeaders(),
//       withCredentials: true
//     });
//   }

//   updateTodo(data: any): Observable<any> {
//     return this.http.put(`${this.baseUrl}/todos/update/${data.id}`, data, {
//       headers: this.getAuthHeaders(),
//       withCredentials: true
//     });
//   }

  
// getLogs(date: string): Observable<any[]> {
//   return this.http.get<any[]>(`${this.baseUrl}/logs/${date}`, {
//     withCredentials: true
//   });
// }

// saveLog(data: any): Observable<any> {
//   return this.http.post(`${this.baseUrl}/logs/insert`, data, {
//     withCredentials: true
//   });
// }


// }
