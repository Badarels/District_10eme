import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Employe } from 'src/app/shared/Model/Employe';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeService {
  private baseUrl = `${environment.apiUrl}/employes`;

  constructor(private http: HttpClient) {}

  getEmploye(): Observable<Employe[]> {
    return this.http.get<Employe[]>(this.baseUrl + "/")
      .pipe(
        catchError(this.handleError)
      );
  }

  getEmpById(empId: number): Observable<Employe> {
    return this.http.get<Employe>(`${this.baseUrl}/${empId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  editEmploye(empId: number, employe: Employe): Observable<Employe> {
    const url = `${this.baseUrl}/${empId}`;
    return this.http.put<Employe>(url, employe)
      .pipe(
        catchError(this.handleError)
      );
  }

  addEmploye(employe: Employe): Observable<Employe> {
    const url = `${this.baseUrl}/`;
    return this.http.post<Employe>(url, employe)
      .pipe(
        catchError(this.handleError)
      );
  }

  ajoutEmploye(employe: Employe): Observable<Employe>{
    return this.http.post<Employe>(`${this.baseUrl}/`, employe);
  }

  archiveEmploye(empId: number): Observable<Employe> {
    const url = `${this.baseUrl}/${empId}/archive`;
    return this.http.put<Employe>(url, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError('Something went wrong; please try again later.');
  }
}

