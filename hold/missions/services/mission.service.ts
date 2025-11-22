import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Missions } from 'src/app/shared/Model/Missions';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMissions(): Observable<Missions[]> {
    return this.http.get<Missions[]>(`${this.baseUrl}/missions`);
  }

  getMissionById(missionId: number): Observable<Missions> {
    return this.http.get<Missions>(`${this.baseUrl}/missions/${missionId}`);
  }

  editMission(missionId: number, mission: Missions): Observable<Missions> {
    const url = `${this.baseUrl}/missions/${missionId}`;
    return this.http.put<Missions>(url, mission);
  }

  addMission(mission: Missions): Observable<Missions> {
    const url = `${this.baseUrl}/missions`;
    return this.http.post<Missions>(url, mission);
  }

  archiveMission(missionId: number): Observable<Missions> {
    const url = `${this.baseUrl}/missions/${missionId}/archive`;
    return this.http.put<Missions>(url, {});
  }
}
