import { Validators, AbstractControl } from '@angular/forms';

export class PasswordValidation implements Validators {
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