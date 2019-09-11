import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import AuthService from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from '../../services/common.servise';
import { AbstractControl } from '@angular/forms';

export class PasswordValidation {

  static MatchPassword(AC: AbstractControl) {
    let password = AC.get('password').value; // to get value in input tag
    let confirmPassword = AC.get('passwordCheck').value; // to get value in input tag
    if (password != confirmPassword) {
      AC.get('passwordCheck').setErrors({ MatchPassword: true })
    } else {
      return null
    }
  }
}

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

  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required
    ]),
    passwordCheck: new FormControl('', [
      Validators.required
    ]),
    firstName: new FormControl('', [
      Validators.required
    ]),
    age: new FormControl('', [
      Validators.required
    ]),
  },
    PasswordValidation.MatchPassword
  );


  registerNewUser() {

    if (!this.form.get('firstName').hasError('required')) {
      if (!this.form.get('email').hasError('required')) {
        if (!this.form.get('email').hasError('email')) {
          if (!this.form.get('password').hasError('required')) {
            if (!this.form.get('passwordCheck').getError('MatchPassword')) {
              if (!this.form.get('age').hasError('required')) {
                const form = {
                  firstName: this.form.get('firstName').value,
                  email: this.form.get('email').value,
                  password: this.form.get('password').value,
                  age: this.form.get('age').value,
                }
                console.log(form);
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
            }
          }
        }
      }
    }
  }
  ngOnInit() {
  }


}
