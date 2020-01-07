import { NgModule } from '@angular/core';
import { TaskHomeComponent } from './task-home/task-home.component';
import { TaskItemComponent } from './task-item/task-item.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskHeaderComponent } from './task-header/task-header.component';
import {TaskRoutingModule} from './task-routing.module';
import {ShardModule} from '../shard/shard.module';
import { CopyTaskComponent } from './copy-task/copy-task.component';
import { NewTaskComponent } from './new-task/new-task.component';
import { NewTaskListComponent } from './new-task-list/new-task-list.component';
import { QuickTaskComponent } from './quick-task/quick-task.component';



@NgModule({
  declarations: [TaskHomeComponent, TaskItemComponent, TaskListComponent, TaskHeaderComponent, CopyTaskComponent, NewTaskComponent, NewTaskListComponent, QuickTaskComponent],
  imports: [
    ShardModule,
    TaskRoutingModule
  ],
  entryComponents: [CopyTaskComponent, NewTaskComponent, NewTaskListComponent]
})
export class TaskModule { }
