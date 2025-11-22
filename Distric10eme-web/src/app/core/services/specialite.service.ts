import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Specialite } from '../models/personnel.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpecialiteService {
  private apiUrl = `${environment.apiUrl}/specialites`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Specialite[]> {
    return this.http.get<Specialite[]>(this.apiUrl);
  }

  findById(id: number): Observable<Specialite> {
    return this.http.get<Specialite>(`${this.apiUrl}/${id}`);
  }

  create(specialite: Specialite): Observable<Specialite> {
    return this.http.post<Specialite>(this.apiUrl, specialite);
  }

  update(id: number, specialite: Specialite): Observable<Specialite> {
    return this.http.put<Specialite>(`${this.apiUrl}/${id}`, specialite);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

