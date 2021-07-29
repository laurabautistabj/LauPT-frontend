import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {switchMap, take} from 'rxjs/operators';
import {ProfessorService} from '../services/professor.service';
import {DashboardProfessorProvider} from '../dashboard-professor/dashboard-professor.provider';

@Injectable({
  providedIn: 'root'
})
export class ProfessorGuard implements CanActivate {

  constructor(private angularFireAuth: AngularFireAuth,
              private professorService: ProfessorService,
              private dashboardProfessorProvider: DashboardProfessorProvider,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.verifyProfessor();
  }

  private async verifyProfessor(): Promise<boolean | UrlTree> {
    const isProfessor = await this.angularFireAuth.authState.pipe(
      take(1),
      switchMap(async (authState) => {
        if (authState) { // check are user is logged in
          const token = await authState.getIdTokenResult();
          if (token.claims.isAdmin) { // check claims
            return this.router.parseUrl('/admin');
          } else if (token.claims.isStudent) {
            return this.router.parseUrl('/student');
          } else {
            return !!token.claims.isProfessor;
          }
        } else {
          return false;
        }
      }),
    ).toPromise();
    if (isProfessor instanceof UrlTree) {
      return isProfessor;
    } else {
      if (!isProfessor) {
        await this.angularFireAuth.signOut();
        return this.router.parseUrl('/auth');
      } else {
        try {
          const professorData = await this.professorService.list();
          this.dashboardProfessorProvider.professorData.next(professorData);
          return isProfessor;
        } catch (error) {
          await this.angularFireAuth.signOut();
          return this.router.parseUrl('/auth');
        }
      }
    }
  }

}
