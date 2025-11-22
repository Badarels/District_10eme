import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UtilisateurModel } from 'src/app/shared/Model/Utilisateur.model';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

// Définir l'interface à l'extérieur de la classe
interface LoginResponse {
  token: string;
  user?: any;
  passwordChanged?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  SECRET = 'businesscenter';
  errCon = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(username: string, password: string): Observable<LoginResponse> {
    const loginRequest = {
      username: username,
      password: password
    };

    // Configuration des headers pour la requête
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      withCredentials: true,
      observe: 'response' as const
    };

    console.log('Tentative de connexion:', {
      url: `${this.apiUrl}/login`,
      body: loginRequest,
      headers: httpOptions.headers,
      withCredentials: httpOptions.withCredentials
    });

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest, httpOptions)
      .pipe(
        tap((response: any) => {
          console.log('Réponse complète du serveur:', response);
          if (response.body && response.body.token) {
            localStorage.setItem('id_token', response.body.token);
            console.log('Token stocké:', response.body.token);
            
            if (response.body.user) {
              localStorage.setItem('mdd_user', JSON.stringify(response.body.user));
            }
          }
        }),
        catchError(error => {
          console.error('Erreur de connexion:', {
            status: error.status,
            message: error.message,
            error: error.error
          });
          this.errCon = true;
          return throwError(() => error);
        })
      );
  }

  async authenticationProcess(url: string, body: any): Promise<boolean> {
    try {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });

      const options = {
        headers: headers,
        withCredentials: true
      };

      const fullUrl = `${this.apiUrl}${url}`;
      console.log('Envoi de la requête:', {
        url: fullUrl,
        body: body
      });

      const data = await this.http.post<LoginResponse>(fullUrl, body, options).toPromise();
      console.log('Réponse:', data);

      if (data?.token) {
        await this.setSession(data);
        const user = await this.identity().toPromise();
        if (user?.passwordChanged) {
          await this.storeUser(user);
          this.router.navigate(['']);
        } else {
          this.router.navigate(['/login/reset-password']);
        }
      }
      return false;
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      this.errCon = true;
      return true;
    }
  }

  async setSession(authResult: LoginResponse): Promise<void> {
    try {
      if (authResult && authResult.token) {
        localStorage.setItem('id_token', authResult.token);
        console.log('Token stocké avec succès:', authResult.token);
      } else {
        console.error('Pas de token dans la réponse');
      }
    } catch (error) {
      console.error('Erreur lors du stockage du token:', error);
    }
  }

  async storeUser(user: any): Promise<void> {
    localStorage.removeItem('mdd_user');
    localStorage.setItem('mdd_user', JSON.stringify(user));
  }

  getToken(): string | null {
    const token = localStorage.getItem('id_token');
    console.log('Token récupéré:', token);
    return token;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  logout(): void {
    localStorage.clear(); // Nettoie tout le localStorage
    this.router.navigate(['/login']);
  }

  identity(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/connected-user`, {
      withCredentials: true
    });
  }

  hasAuthority(authorities: string[], user: UtilisateurModel): boolean {
    for (const authority of authorities) {
      if (user?.roles?.nomRoles === authority) {
        return true;
      }
    }
    return false;
  }
}
