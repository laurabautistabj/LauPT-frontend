import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UnitComponent} from './unit.component';
import {ListComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '',
    component: UnitComponent,
    children: [
      {
        path: '',
        component: ListComponent
      }, {
        path: ':id',
        loadChildren: () => import('./subject/subject.module').then(m => m.SubjectModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitRoutingModule {
}
