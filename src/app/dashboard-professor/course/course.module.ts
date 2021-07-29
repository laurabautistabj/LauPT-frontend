import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import { ItemComponent } from './item/item.component';
import { ListComponent } from './list/list.component';
import {SharedModule} from '../../shared/shared.module';
import {CourseRoutingModule} from './course-routing.module';
import {CourseComponent} from './course.component';


@NgModule({
  declarations: [CourseComponent, ItemComponent, ListComponent],
  imports: [
    CommonModule,
    CourseRoutingModule,
    SharedModule
  ]
})
export class CourseModule {
}
