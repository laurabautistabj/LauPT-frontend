import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StudentRoutingModule} from './student-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {StudentComponent} from './student.component';
import {ListComponent} from './list/list.component';
import {DetailComponent} from './detail/detail.component';


@NgModule({
  declarations: [
    StudentComponent,
    ListComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    SharedModule
  ]
})
export class StudentModule {
}
