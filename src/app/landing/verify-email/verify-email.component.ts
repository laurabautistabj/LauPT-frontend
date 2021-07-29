import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {NavigationProvider} from "../../providers/navigation.provider";

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.sass']
})
export class VerifyEmailComponent implements OnInit, OnDestroy {

  private subscription = new Subscription();
  showResend = false;

  constructor(private angularFireAuth: AngularFireAuth,
              private navigationProvider: NavigationProvider,
              private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    await this.initSubscription();
    await this.sendEmailVerification();
  }

  private async initSubscription(): Promise<void> {
    const userStatus = this.angularFireAuth.user.subscribe(value => {
      if (value.emailVerified) {
        this.router.navigateByUrl('/student');
      }
    });
    this.subscription.add(userStatus);
  }

  async sendEmailVerification(): Promise<void> {
    const user = await this.angularFireAuth.currentUser;
    if (user.emailVerified) {
      return;
    }
    this.showResend = false;
    this.navigationProvider.showLoader();
    await (await this.angularFireAuth.currentUser).sendEmailVerification();
    this.navigationProvider.hideLoader();
    setTimeout(() => {
      this.showResend = true;
    }, 30000);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
