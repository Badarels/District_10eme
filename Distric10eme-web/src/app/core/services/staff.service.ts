import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Personnel } from '../models/personnel.model';

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {
  private apiUrl = `${environment.apiUrl}/personnel`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Personnel[]> {
    return this.http.get<Personnel[]>(this.apiUrl);
  }

  findById(id: number): Observable<Personnel> {
    return this.http.get<Personnel>(`${this.apiUrl}/${id}`);
  }

  create(member: Personnel): Observable<Personnel> {
    return this.http.post<Personnel>(this.apiUrl, member);
  }

  update(id: number, member: Personnel): Observable<Personnel> {
    return this.http.put<Personnel>(`${this.apiUrl}/${id}`, member);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
