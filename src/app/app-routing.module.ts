import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AngularFireAuthGuard, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {StudentGuard} from "./guards/student.guard";
import {ProfessorGuard} from "./guards/professor.guard";
import {AdminGuard} from "./guards/admin.guard";
import {VerifyEmailGuard} from "./guards/verify-email.guard";

const redirectToLanding = () => redirectUnauthorizedTo(['/auth']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule)
  }, {
    path: 'student',
    loadChildren: () => import('./dashboard-student/dashboard-student.module').then(m => m.DashboardStudentModule),
    canActivate: [AngularFireAuthGuard, StudentGuard, VerifyEmailGuard],
    data: {
      authGuardPipe: redirectToLanding
    }
  }, {
    path: 'professor',
    loadChildren: () => import('./dashboard-professor/dashboard-professor.module').then(m => m.DashboardProfessorModule),
    canActivate: [AngularFireAuthGuard, ProfessorGuard, VerifyEmailGuard],
    data: {
      authGuardPipe: redirectToLanding
    }
  }, {
    path: 'admin',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AngularFireAuthGuard, AdminGuard, VerifyEmailGuard],
    data: {
      authGuardPipe: redirectToLanding
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
