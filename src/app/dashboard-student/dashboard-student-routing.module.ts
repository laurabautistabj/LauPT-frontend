import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardStudentComponent} from './dashboard-student.component';
import {ProfileComponent} from './profile/profile.component';
import {EditProfileComponent} from './edit-profile/edit-profile.component';
import {ConfigurationComponent} from './configuration/configuration.component';
import {HomeComponent} from './home/home.component';
import {LearningStyleQuestionnaireComponent} from "./learning-style-questionnaire/learning-style-questionnaire.component";
import {LearningStyleGuard} from "./guards/learning-style.guard";

const routes: Routes = [
  {
    path: '',
    component: DashboardStudentComponent,
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [LearningStyleGuard]
      }, {
        path: 'edit-profile',
        component: EditProfileComponent,
        canActivate: [LearningStyleGuard]
      }, {
        path: 'configuration',
        component: ConfigurationComponent,
        canActivate: [LearningStyleGuard]
      }, {
        path: 'learning-style-questionnaire',
        component: LearningStyleQuestionnaireComponent
      }, {
        path: '',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
        canActivate: [LearningStyleGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardStudentRoutingModule {
}
