import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerifyEmailGuard implements CanActivate {

  constructor(private angularFireAuth: AngularFireAuth,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.verifyEmail();
  }

  private async verifyEmail(): Promise<boolean | UrlTree> {
    await new Promise(resolve => {
      setTimeout(() => {
        resolve('');
      }, 500);
    });
    const user = await this.angularFireAuth.currentUser;
    if (user) {
      return user.emailVerified ? user.emailVerified : this.router.parseUrl('/verify-email');
    } else {
      return this.router.parseUrl('/auth');
    }
  }

}
