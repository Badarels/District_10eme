import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { AuthServices } from '../Services/auth.services';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent {
  form: FormGroup;
  err = '';
  passwordFieldType: string = 'password';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthServices,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      username: [null, Validators.compose([Validators.required, Validators.email])],
      password: [null, Validators.compose([Validators.required])]
    });
  }

  togglePasswordVisibility(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.passwordFieldType = checkbox.checked ? 'text' : 'password';
  }

  login(): void {
    
    console.log("login")
    const val = this.form.value;
    if (val.username && val.password) {
      this.authService.login(val).subscribe({
        next: (success) => {
          if (success) {
            console.log("Succes", success)
            this.router.navigateByUrl('/Accueil/accueil');
          } else {
            console.log("Error", success)
            
            this.err = 'Login ou mot de passe incorrect';
          }
        },
        error: (error) => {
          this.err = (error && error.error && error.error.message) ? error.error.message : 'Une erreur est survenue lors de la connexion';
        }
      });
    } else {
      this.err = 'Tous les champs sont obligatoires';
    }
  }
}
