import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonnelMedical, Specialite, TypePersonnel } from '../models/personnel.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {
  private apiUrl = `${environment.apiUrl}/personnel`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<PersonnelMedical[]> {
    return this.http.get<PersonnelMedical[]>(this.apiUrl);
  }

  findById(id: number): Observable<PersonnelMedical> {
    return this.http.get<PersonnelMedical>(`${this.apiUrl}/${id}`);
  }

  findByTypePersonnel(typePersonnel: TypePersonnel): Observable<PersonnelMedical[]> {
    return this.http.get<PersonnelMedical[]>(`${this.apiUrl}/type/${typePersonnel}`);
  }

  findMedecins(): Observable<PersonnelMedical[]> {
    return this.http.get<PersonnelMedical[]>(`${this.apiUrl}/medecins`);
  }

  findInfirmiers(): Observable<PersonnelMedical[]> {
    return this.http.get<PersonnelMedical[]>(`${this.apiUrl}/infirmiers`);
  }

  create(personnel: PersonnelMedical): Observable<PersonnelMedical> {
    return this.http.post<PersonnelMedical>(this.apiUrl, personnel);
  }

  update(id: number, personnel: PersonnelMedical): Observable<PersonnelMedical> {
    return this.http.put<PersonnelMedical>(`${this.apiUrl}/${id}`, personnel);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
