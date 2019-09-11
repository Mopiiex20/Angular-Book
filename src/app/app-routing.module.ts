import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentComponent } from './components/content/content.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import {
  AuthGuardService as AuthGuard
} from './services/auth-guard-service';
import { AdminComponent } from './components/admin/admin.component';
import { NotWorkingComponent } from './components/notWorkingComponent/notWorking';
import { BookInfoComponent } from './components/bookInfo/bookInfo.component';

const routes: Routes = [
  { path: '', component: ContentComponent },
  { path: 'signup', component: RegisterComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin', component: AdminComponent, canActivate: [AuthGuard]
  },
  {
    path: 'serverError/:caller', component: NotWorkingComponent
  },
  {
    path: 'bookInfo/:bookId', component: BookInfoComponent
  },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
