import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hospitalisation } from '../models/hospitalisation.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HospitalisationService {
  private apiUrl = `${environment.apiUrl}/hospitalisations`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Hospitalisation[]> {
    return this.http.get<Hospitalisation[]>(this.apiUrl);
  }

  findById(id: number): Observable<Hospitalisation> {
    return this.http.get<Hospitalisation>(`${this.apiUrl}/${id}`);
  }

  findByPatientId(patientId: number): Observable<Hospitalisation[]> {
    return this.http.get<Hospitalisation[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  create(hospitalisation: Hospitalisation): Observable<Hospitalisation> {
    return this.http.post<Hospitalisation>(this.apiUrl, hospitalisation);
  }

  update(id: number, hospitalisation: Hospitalisation): Observable<Hospitalisation> {
    return this.http.put<Hospitalisation>(`${this.apiUrl}/${id}`, hospitalisation);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

