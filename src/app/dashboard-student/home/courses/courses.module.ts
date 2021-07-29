import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CoursesRoutingModule} from './courses-routing.module';
import {CoursesComponent} from './courses.component';
import {SharedModule} from '../../../shared/shared.module';
import { ListComponent } from './list/list.component';
import { ItemComponent } from './item/item.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { QuestionnaireQuestionComponent } from './questionnaire-question/questionnaire-question.component';


@NgModule({
  declarations: [
    CoursesComponent,
    ListComponent,
    ItemComponent,
    QuestionnaireComponent,
    QuestionnaireQuestionComponent
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    SharedModule
  ]
})
export class CoursesModule {
}
