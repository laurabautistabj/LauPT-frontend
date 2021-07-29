import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {switchMap, take} from 'rxjs/operators';
import {StudentService} from "../services/student.service";
import {DashboardStudentProvider} from "../dashboard-student/dashboard-student.provider";
import {StudentLearningStyleService} from "../services/student-learning-style.service";

@Injectable({
  providedIn: 'root'
})
export class StudentGuard implements CanActivate {

  constructor(private angularFireAuth: AngularFireAuth,
              private studentService: StudentService,
              private studentLearningStyleService: StudentLearningStyleService,
              private dashboardStudentProvider: DashboardStudentProvider,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.verifyStudent();
  }

  private async verifyStudent(): Promise<boolean | UrlTree> {
    const isStudent = await this.angularFireAuth.authState.pipe(
      take(1),
      switchMap(async (authState) => {
        if (authState) { // check are user is logged in
          const token = await authState.getIdTokenResult();
          if (token.claims.isAdmin) { // check claims
            return this.router.parseUrl('/admin');
          } else if (token.claims.isProfessor) {
            return this.router.parseUrl('/professor');
          } else {
            return !!token.claims.isStudent;
          }
        } else {
          return false;
        }
      }),
    ).toPromise();
    if (isStudent instanceof UrlTree) {
      return isStudent;
    } else {
      if (!isStudent) {
        await this.angularFireAuth.signOut();
        return this.router.parseUrl('/auth');
      } else {
        try {
          const studentData = await this.studentService.list();
          this.dashboardStudentProvider.studentData.next(studentData);
          try {
            const learningStyle = await this.studentLearningStyleService.retrieve();
            this.dashboardStudentProvider.learningStyle.next(learningStyle);
          } catch (error) {
            this.dashboardStudentProvider.learningStyle.next(null);
          }
          return isStudent;
        } catch (error) {
          await this.angularFireAuth.signOut();
          return this.router.parseUrl('/auth');
        }
      }
    }
  }

}
