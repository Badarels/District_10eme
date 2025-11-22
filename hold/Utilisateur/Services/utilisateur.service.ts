import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { subscriptionLogsToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { RoleModel } from 'src/app/shared/Model/Role.Model';
import { UtilisateurModel } from 'src/app/shared/Model/Utilisateur.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private baseUrl = `${environment.apiUrl}/users`; 

  constructor(private http: HttpClient){}

  getUsers(): Observable<UtilisateurModel[]> {
    return this.http.get<UtilisateurModel[]>(this.baseUrl+'/listUsers');
  } 
  getUserById(id:number): Observable<UtilisateurModel> {
    return this.http.get<UtilisateurModel>(`${this.baseUrl}/getUserById/${id}`);
  } 

  addUser(Utilisateur: UtilisateurModel){
    return this.http.post<UtilisateurModel>(this.baseUrl+'/ajoutUsers',Utilisateur);
  }

  editUser(utilisateur: UtilisateurModel, utilisateurID: number): Observable<UtilisateurModel> {
    const url = `${this.baseUrl}/${utilisateurID}`;
    return this.http.put<UtilisateurModel>(url, utilisateur);
  }
  
  /*editUser(Utilisateur: UtilisateurModel, UtilisateurID: number): Observable<UtilisateurModel> {
    const url = `${this.baseUrl}/${usersId}`;
    return this.http.put<UtilisateurModel>(url, Utilisateur);
  }*/
  
  getRoles(): Observable<RoleModel[]> {
    return this.http.get<RoleModel[]>(this.baseUrl+'/roles');
  } 

  archiveUsers(utilisateurId: number): Observable<UtilisateurModel>{
    const url = `${this.baseUrl}/archive/${utilisateurId}`;
    return this.http.put<UtilisateurModel>(url, {});
  }

  

}
