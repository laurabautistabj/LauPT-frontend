import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SubjectRoutingModule} from './subject-routing.module';
import {SubjectComponent} from './subject.component';
import {ListComponent} from './list/list.component';
import {ItemComponent} from './item/item.component';
import {SharedModule} from '../../../../shared/shared.module';
import { ResourcesComponent } from './resources/resources.component';


@NgModule({
  declarations: [SubjectComponent, ListComponent, ItemComponent, ResourcesComponent],
  imports: [
    CommonModule,
    SubjectRoutingModule,
    SharedModule
  ]
})
export class SubjectModule {
}
