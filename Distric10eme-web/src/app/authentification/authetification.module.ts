import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './Services/auth.service';
import { LoginComponent } from './login/login.component';
import { AuthentificatioRoutingModule } from './authentificatio-routing.module';
import { FormsModule} from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
      LoginComponent
  ],
  imports: [
    AuthentificatioRoutingModule,
    FormsModule,
    SharedModule
  ],
  providers: [AuthService]
})
export class AuthetificationModule { }
