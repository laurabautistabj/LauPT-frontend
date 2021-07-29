import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardStudentRoutingModule } from './dashboard-student-routing.module';
import { DashboardStudentComponent } from './dashboard-student.component';
import {SharedModule} from '../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { LearningStyleQuestionnaireComponent } from './learning-style-questionnaire/learning-style-questionnaire.component';


@NgModule({
  declarations: [DashboardStudentComponent, ProfileComponent, EditProfileComponent, ConfigurationComponent, LearningStyleQuestionnaireComponent],
  imports: [
    CommonModule,
    DashboardStudentRoutingModule,
    SharedModule
  ]
})
export class DashboardStudentModule { }
