import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Adresse } from 'src/app/shared/Model/Adresse';
import { Medecin } from 'src/app/shared/Model/Medecin';
import { Specialite } from 'src/app/shared/Model/Specialite';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedecinService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    console.error('Une erreur s\'est produite :', error);
    return throwError(error);
  }

  getMedecin(): Observable<Medecin[]> {
    return this.http.get<Medecin[]>(`${this.baseUrl}/Medecins`)
      .pipe(catchError(this.handleError));
  }

  getMedecinById(medecinId: number): Observable<Medecin> {
    return this.http.get<Medecin>(`${this.baseUrl}/Medecins/${medecinId}`)
      .pipe(catchError(this.handleError));
  }

  getSpecialite(): Observable<Specialite[]> {
    return this.http.get<Specialite[]>(`${this.baseUrl}/Specialites`)
      .pipe(catchError(this.handleError));
  }

  getAdresse(): Observable<Adresse[]> {
    return this.http.get<Adresse[]>(`${this.baseUrl}/Adresses`)
      .pipe(catchError(this.handleError));
  }

  getSpecialiteByMedecin(medecinId: number): Observable<Specialite> {
    return this.http.get<Specialite>(`${this.baseUrl}/getSpecialiteByMedecin/${medecinId}`)
      .pipe(catchError(this.handleError));
  }

  searchMedecinsByVille(ville: string): Observable<Medecin[]> {
    return this.http.get<Medecin[]>(`${this.baseUrl}/getMedecinByVille/${ville}`)
      .pipe(catchError(this.handleError));
  }

  ajoutMedecin(medecin: Medecin): Observable<Medecin> {
    return this.http.post<Medecin>(`${this.baseUrl}/Medecins`, medecin)
      .pipe(catchError(this.handleError));
  }
}
