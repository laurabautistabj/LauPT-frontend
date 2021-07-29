import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardProfessorComponent} from './dashboard-professor.component';
import {HomeComponent} from './home/home.component';
import {StudentComponent} from './student/student.component';
import {QuestionnaireComponent} from './questionnaire/questionnaire.component';
import {ProfileComponent} from './profile/profile.component';
import {EditProfileComponent} from './edit-profile/edit-profile.component';
import {ConfigurationComponent} from './configuration/configuration.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardProfessorComponent,
    children: [
      {
        path: 'students',
        loadChildren: () => import('./student/student.module').then(m => m.StudentModule)
      }, {
        path: 'courses',
        loadChildren: () => import('./course/course.module').then(m => m.CourseModule)
      }, {
        path: 'questionnaires',
        component: QuestionnaireComponent
      }, {
        path: 'profile',
        component: ProfileComponent
      }, {
        path: 'edit-profile',
        component: EditProfileComponent
      }, {
        path: 'configuration',
        component: ConfigurationComponent
      }, {
        path: '',
        component: HomeComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardProfessorRoutingModule {
}
