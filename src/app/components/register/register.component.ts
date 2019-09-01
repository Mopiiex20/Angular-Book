import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import AuthService from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from '../../services/common.servise';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private loginService: LoginService
  ) { }

  RegisterForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    firstName: new FormControl(''),
    age: new FormControl('')

  });
  registerNewUser() {

    const form = this.RegisterForm.value;

    this.authService.post('users/signup', form).subscribe(
      (data: any) => {
        const loginData = {
          email: form.email,
          password: form.password
        }
        this.loginService.registerToLogin(loginData)
        this.router.navigateByUrl("/");
      },
      (error: any) => {
        this._snackBar.open(error.error.message);
      }

    );
  }
  ngOnInit() {
  }


}
