import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {NavigationProvider} from '../../providers/navigation.provider';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfirmField, PasswordValidator} from '../../util/custom.validators';

@Component({
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.sass']
})
export class ResetPasswordComponent implements OnInit {

  resetPassword = new FormGroup({
    password: new FormControl('', [Validators.required, PasswordValidator]),
    password_confirmation: new FormControl('', [Validators.required])
  }, ConfirmField('password'));

  resetEmail;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private angularFireAuth: AngularFireAuth,
              private navigationProvider: NavigationProvider,
              private matSnackBar: MatSnackBar,
              private matDialogRef: MatDialogRef<ResetPasswordComponent>) {
  }

  ngOnInit(): void {
    this.verifyData().then();
  }

  private async verifyData(): Promise<void> {
    this.navigationProvider.showLoader();
    try {
      this.resetEmail = await this.angularFireAuth.verifyPasswordResetCode(this.data.oobCode);
    } catch (error) {
      this.matSnackBar.open('El link ha caducado o es inválido', '', {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: 'custom-notification'
      });
      this.matDialogRef.close(false);
    } finally {
      this.navigationProvider.hideLoader();
    }
  }

  async onResetPassword(): Promise<void> {
    this.navigationProvider.showLoader();
    try {
      await this.angularFireAuth.confirmPasswordReset(this.data.oobCode, this.resetPassword.value.password);
      this.navigationProvider.hideLoader();
      this.matDialogRef.close(true);
    } catch (error) {
      this.navigationProvider.hideLoader();
      this.matDialogRef.close(false);
    } finally {

    }
  }

}
