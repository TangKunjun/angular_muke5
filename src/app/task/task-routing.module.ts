import {RouterModule, Routes} from '@angular/router';
import {TaskHomeComponent} from './task-home/task-home.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
  {path: 'tasklist', component: TaskHomeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TaskRoutingModule {}
