import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NavigationProvider} from '../../../providers/navigation.provider';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.sass']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordGroup = new FormGroup({
    email: new FormControl('', [Validators.required])
  });

  constructor(private angularFireAuth: AngularFireAuth,
              private matDialogRef: MatDialogRef<ForgotPasswordComponent>,
              private navigationProvider: NavigationProvider,
              private matSnackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  async onForgotPassword(): Promise<void> {
    try {
      this.navigationProvider.showLoader();
      await this.angularFireAuth.sendPasswordResetEmail(this.forgotPasswordGroup.value.email);
      this.navigationProvider.hideLoader();
      this.matDialogRef.close();
      this.matSnackBar.open(
        `Se ha enviado un correo a ${this.forgotPasswordGroup.value.email} con las instrucciones para reestablecer tu contraseña`,
        '',
        {
          duration: 5000,
          verticalPosition: 'top'
        }
      );
    } catch (error) {
      this.navigationProvider.hideLoader();
      console.log('error', error);
    }
  }

}
