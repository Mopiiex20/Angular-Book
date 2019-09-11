import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeadderComponent, CartPopUp } from './components/headder/headder.component';
import { ContentComponent } from './components/content/content.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { RegisterComponent } from './components/register/register.component';
import { HighlightDirective } from './components/headder/headder.directive';
import { CustomHttpInterceptorService } from './services/interceptor';
import AuthService from './services/auth.service';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginService } from './services/common.servise';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { UserService } from './services/users.service';
import { AuthGuardService } from './services/auth-guard-service';
import { AdminComponent, Dialog } from './components/admin/admin.component';
import { MatNativeDateModule } from '@angular/material/core'
import { NotWorkingComponent } from './components/notWorkingComponent/notWorking';
import { environment } from 'src/environments/environment';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { BookInfoComponent } from './components/bookInfo/bookInfo.component';

export function tokenGetter() {

  return localStorage.getItem("token");

}
environment

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
  ],
  entryComponents: [CartPopUp, Dialog],
  declarations: [
    Dialog,
    HighlightDirective,
    AppComponent,
    NotWorkingComponent,
    HeadderComponent,
    ContentComponent,
    RegisterComponent,
    ProfileComponent,
    AdminComponent,
    BookInfoComponent,

    CartPopUp,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptorService, multi: true },
    UserService,
    LoginService,
    AuthService,
    AuthGuardService,
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
