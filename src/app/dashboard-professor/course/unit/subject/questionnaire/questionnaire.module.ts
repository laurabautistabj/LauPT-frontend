import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {QuestionnaireRoutingModule} from './questionnaire-routing.module';
import {QuestionnaireComponent} from './questionnaire.component';
import {ItemComponent} from './item/item.component';
import {SharedModule} from '../../../../../shared/shared.module';


@NgModule({
  declarations: [QuestionnaireComponent, ItemComponent],
  imports: [
    CommonModule,
    QuestionnaireRoutingModule,
    SharedModule
  ]
})
export class QuestionnaireModule {
}
