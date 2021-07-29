import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NavigationProvider} from '../../providers/navigation.provider';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {MatDialog} from '@angular/material/dialog';
import {environment} from '../../../environments/environment';
import {CaptchaService} from '../../services/captcha.service';
import firebase from 'firebase/app';
import {StudentService} from "../../services/student.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.sass']
})
export class AuthComponent implements OnInit {

  reCaptchaSiteKey = environment.reCaptchaSiteKey;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    reCaptcha: new FormControl('', [Validators.required])
  });

  constructor(private navigationProvider: NavigationProvider,
              private matSnackBar: MatSnackBar,
              private angularFireAuth: AngularFireAuth,
              private matDialog: MatDialog,
              private captchaService: CaptchaService,
              private studentService: StudentService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  async onLogin(): Promise<void> {
    this.navigationProvider.showLoader();
    try {
      const response = await this.captchaService.validate(this.loginForm.value.reCaptcha);
      if (response.success) {
        try {
          await this.angularFireAuth.signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password);
          await this.router.navigateByUrl('/student');
        } catch (error) {
          this.matSnackBar.open(error.message, '', {
            duration: 5000,
            verticalPosition: 'top'
          });
        }
      } else {
        this.matSnackBar.open('La verificación Captcha ha fallado', '', {
          duration: 5000,
          verticalPosition: 'top'
        });
      }
    } catch (e) {
      this.matSnackBar.open('La verificación Captcha ha fallado', '', {
        duration: 5000,
        verticalPosition: 'top'
      });
    } finally {
      this.navigationProvider.hideLoader();
    }
  }

  async onCaptchaResolved(resolved): Promise<void> {
    this.loginForm.patchValue({reCaptcha: resolved});
  }

  async onForgotPassword(): Promise<void> {
    this.matDialog.open(ForgotPasswordComponent);
  }

  async onGoogleLogin(): Promise<void> {
    try {
      await this.angularFireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      this.navigationProvider.showLoader();
      try {
        await this.studentService.createSocial();
        await (await this.angularFireAuth.currentUser).getIdToken(true);
        await this.router.navigateByUrl('/student');
      } catch (e) {
        this.matSnackBar.open(e.error.message, '', {
          duration: 5000,
          verticalPosition: 'top'
        });
      } finally {
        this.navigationProvider.hideLoader();
      }
    } catch (error) {
      this.matSnackBar.open(error.message, '', {
        duration: 5000,
        verticalPosition: 'top'
      });
    }
  }
}
