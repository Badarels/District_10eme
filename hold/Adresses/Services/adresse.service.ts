import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Adresse } from 'src/app/shared/Model/Adresse';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdresseService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient ) { }

  public getAllAdresses(): Observable<Adresse[]> {
    return this.http.get<Adresse[]>(this.baseUrl+"/Adresses");
  }

  public ajoutAdresse(adresse: Adresse): Observable<Adresse>{
    return this.http.post<Adresse>(this.baseUrl+"/Adresses",adresse);
  }
  
}
