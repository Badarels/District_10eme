import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// UI Modules
import { NgbModule, NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// Application Modules
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutsModule } from './layouts/layouts.module';
import { AuthetificationModule } from './authentification/authetification.module';
import { SharedModule } from './shared/shared.module';
import { TinyMCEModule } from './shared/tinymce.module';

// Interceptors
import { JwtInterceptor } from './shared/helper/jwt.interceptor';
import { JsonContentTypeInterceptor } from './shared/helper/jsonContentType.interceptor';

// Services
import { AuthService } from './authentification/Services/auth.service';
import { AuthServices } from './authentification/Services/auth.services';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // Angular Modules
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    
    // Application Modules
    AppRoutingModule,
    LayoutsModule,
    AuthetificationModule,
    SharedModule,
    TinyMCEModule,
    
    // UI Modules
    NgbModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    ToastrModule.forRoot(),
    
    // Material Modules
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JsonContentTypeInterceptor, multi: true },
    AuthService,
    AuthServices,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
