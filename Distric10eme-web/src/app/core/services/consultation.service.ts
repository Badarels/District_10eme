import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consultation } from '../models/consultation.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  private apiUrl = `${environment.apiUrl}/consultations`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(this.apiUrl);
  }

  findById(id: number): Observable<Consultation> {
    return this.http.get<Consultation>(`${this.apiUrl}/${id}`);
  }

  findByPatientId(patientId: number): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  create(consultation: Consultation): Observable<Consultation> {
    return this.http.post<Consultation>(this.apiUrl, consultation);
  }

  update(id: number, consultation: Consultation): Observable<Consultation> {
    return this.http.put<Consultation>(`${this.apiUrl}/${id}`, consultation);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createWithFiles(formData: FormData): Observable<Consultation> {
    return this.http.post<Consultation>(`${this.apiUrl}/with-files`, formData);
  }
}

