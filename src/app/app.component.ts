import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {ResetPasswordComponent} from './shared/reset-password/reset-password.component';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {VerifyEmailComponent} from './shared/verify-email/verify-email.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'app';

  constructor(private matIconRegistry: MatIconRegistry,
              private activatedRoute: ActivatedRoute,
              private domSanitizer: DomSanitizer,
              private matDialog: MatDialog,
              private router: Router) {
  }

  ngOnInit(): void {
    this.initIcons();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.checkParams(this.activatedRoute.snapshot.queryParams).then();
    }, 500);
  }

  private initIcons(): void {
    this.matIconRegistry.addSvgIcon(
      'login_google',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/logos/google.svg')
    );
  }

  private async checkParams(params): Promise<void> {
    const mode = params.mode;
    switch (mode) {
      case 'resetPassword':
        const isResetSuccessful = await this.matDialog.open(ResetPasswordComponent, {
          data: params
        }).afterClosed().toPromise();
        if (isResetSuccessful) {
          await this.router.navigateByUrl('/auth', {replaceUrl: true});
        } else {
          await this.router.navigateByUrl('/', {replaceUrl: true});
        }
        break;
      case 'verifyEmail':
        const isVerifySuccessful = await this.matDialog.open(VerifyEmailComponent, {
          data: params
        }).afterClosed().toPromise();
        if (isVerifySuccessful) {
          await this.router.navigateByUrl('/auth', {replaceUrl: true});
        } else {
          await this.router.navigateByUrl('/', {replaceUrl: true});
        }
        break;
      default:
        break;
    }
  }
}
