import {AbstractControl, ValidatorFn} from '@angular/forms';

const passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.])(?=.{10,})');

export function ConfirmField(field: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {

    if (control.get(field).value !== control.get(`${field}_confirmation`).value) {
      control.get(`${field}_confirmation`).setErrors({confirmation: true});
      return {
        confirmation: true
      };
    } else {
      control.get(`${field}_confirmation`).setErrors(null);
    }

    return null;
  };
}

export function PasswordValidator(control: AbstractControl): { [key: string]: any } | null {
  const value = control.value;
  if (!value) {
    return null;
  }
  if (passwordRegex.test(value)) {
    return null;
  }
  return {
    password: {
      message: 'Alfanumérica, al menos un caracter especial y longitud mínima 10'
    }
  };
}
