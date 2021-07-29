import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {switchMap, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private angularFireAuth: AngularFireAuth,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.angularFireAuth.authState.pipe(
      take(1),
      switchMap(async (authState) => {
        if (authState) { // check are user is logged in
          const token = await authState.getIdTokenResult();
          if (token.claims.isAdmin) { // check claims
            return true;
          } else if (token.claims.isProfessor) {
            this.router.navigate(['/professor']).then();
            return false;
          } else if (token.claims.isStudent) {
            this.router.navigate(['/student']).then();
            return false;
          } else {
            this.angularFireAuth.signOut().then(value => {
              this.router.navigate(['/auth']).then();
            });
            return false;
          }
        } else {
          this.router.navigate(['/auth']).then();
          return false;
        }
      }),
    );
  }

}
