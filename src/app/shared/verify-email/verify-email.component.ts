import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AngularFireAuth} from '@angular/fire/auth';
import {NavigationProvider} from '../../providers/navigation.provider';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.sass']
})
export class VerifyEmailComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private angularFireAuth: AngularFireAuth,
              private navigationProvider: NavigationProvider,
              private matSnackBar: MatSnackBar,
              private matDialogRef: MatDialogRef<VerifyEmailComponent>) {
  }

  ngOnInit(): void {
    this.verifyEmail().then();
  }

  private async verifyEmail(): Promise<void> {
    this.navigationProvider.showLoader();
    try {
      await this.angularFireAuth.applyActionCode(this.data.oobCode);
      this.navigationProvider.hideLoader();
      this.matDialogRef.close(true);
    } catch (error) {
      this.matSnackBar.open('El link ha caducado o es inválido', '', {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: 'custom-notification'
      });
      this.navigationProvider.hideLoader();
      this.matDialogRef.close(false);
    } finally {
    }
  }
}
