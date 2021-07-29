import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {DashboardStudentProvider} from '../dashboard-student.provider';
import {StudentLearningStyleService} from "../../services/student-learning-style.service";

@Injectable({
  providedIn: 'root'
})
export class LearningStyleGuard implements CanActivate {

  constructor(private dashboardStudentProvider: DashboardStudentProvider,
              private studentLearningStyleService: StudentLearningStyleService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.fetchLearningStyle();
  }

  private async fetchLearningStyle(): Promise<boolean | UrlTree> {
    if (this.dashboardStudentProvider.learningStyle.value) {
      return !!this.dashboardStudentProvider.learningStyle.value ? true : this.router.parseUrl('/student/learning-style-questionnaire');
    } else {
      try {
        const learningStyle = await this.studentLearningStyleService.retrieve();
        this.dashboardStudentProvider.learningStyle.next(learningStyle);
        return true;
      } catch (error) {
        this.dashboardStudentProvider.learningStyle.next(null);
        return this.router.parseUrl('/student/learning-style-questionnaire');
      }
    }
  }

}
