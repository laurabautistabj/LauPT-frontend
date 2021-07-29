import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UnitRoutingModule} from './unit-routing.module';
import {UnitComponent} from './unit.component';
import {ListComponent} from './list/list.component';
import {ItemComponent} from './item/item.component';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  declarations: [UnitComponent, ListComponent, ItemComponent],
  imports: [
    CommonModule,
    UnitRoutingModule,
    SharedModule
  ]
})
export class UnitModule {
}
