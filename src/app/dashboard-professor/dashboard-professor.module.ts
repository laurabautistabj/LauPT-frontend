import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardProfessorRoutingModule} from './dashboard-professor-routing.module';
import {DashboardProfessorComponent} from './dashboard-professor.component';
import {SharedModule} from '../shared/shared.module';
import {HomeComponent} from './home/home.component';
import {QuestionnaireComponent} from './questionnaire/questionnaire.component';
import {ConfigurationComponent} from './configuration/configuration.component';
import {ProfileComponent} from './profile/profile.component';
import {EditProfileComponent} from './edit-profile/edit-profile.component';


@NgModule({
  declarations: [DashboardProfessorComponent, HomeComponent, QuestionnaireComponent, ConfigurationComponent, ProfileComponent, EditProfileComponent],
  imports: [
    CommonModule,
    DashboardProfessorRoutingModule,
    SharedModule
  ]
})
export class DashboardProfessorModule {
}
