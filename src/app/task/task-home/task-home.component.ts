import {ChangeDetectionStrategy, Component, HostBinding, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {CopyTaskComponent} from '../copy-task/copy-task.component';
import {NewTaskComponent} from '../new-task/new-task.component';
import {ConfirmDialogComponent} from '../../shard/confirm-dialog/confirm-dialog.component';
import {NewTaskListComponent} from '../new-task-list/new-task-list.component';
import {slideToRight} from "../../anims/router.anim";

@Component({
  selector: 'app-task-home',
  templateUrl: './task-home.component.html',
  styleUrls: ['./task-home.component.scss'],
  animations: [slideToRight],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskHomeComponent implements OnInit {

  @HostBinding('@routeAnim')

  lists = [
    {
      id: 1,
      name: '待办',
      order: 1,
      tasks: [
        {
          id: 1,
          desc: '任务一： 去星巴克买杯咖啡',
          completed: true,
          priority: 3,
          owner: {
            id: 1,
            name: '张三',
            avatar: 'avatars:svg-11'
          },
          dueDate: new Date(),
        },
        {
          id: 2,
          desc: '任务二：完成老板布置的ppt作业',
          completed: false,
          priority: 2,
          owner: {
            id: 1,
            name: '李四',
            avatar: 'avatars:svg-12'
          },
          dueDate: new Date()
        }
      ],
    },
    {
      id: 2,
      name: '进行中',
      order: 2,
      tasks: [
        {
          id: 1,
          desc: '任务三：项目代码评审',
          completed: false,
          priority: 1,
          owner: {
            id: 1,
            name: '王五',
            avatar: 'avatars:svg-13'
          },
          dueDate: new  Date(),
          reminder: new Date()
        },
        {
          id: 2,
          desc: '任务四: 制定项目计划',
          completed: false,
          priority: 2,
          owner: {
            id: 1,
            name: '李四',
            avatar: 'avatars:svg-12'
          },
          dueDate: new Date(),
        }
      ]
    }
  ];
  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  launchNewTaskDialog() {
    this.dialog.open(NewTaskComponent, {data: {title: '新建任务'}});
  }
  launchCopyTaskDialog() {
    const dialogRef = this.dialog.open(CopyTaskComponent, {data: {lists: this.lists}});
  }

  launchUpdateTaskDialog(task) {
    const dialogRef = this.dialog.open(NewTaskComponent, {data: {title: '修改任务', task: task}});
  }

  launchRemoveTaskDialog() {
    const  dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '删除提示',
        content: '是否删除当前任务？'
      }
    });
  }

  launchEditListTaskDialog() {
    const  dialogRef = this.dialog.open(NewTaskListComponent, {
      data: {
        title: '更改列表名称'
      }
    });
  }

  launchNewListTaskDialog() {
    const  dialogRef = this.dialog.open(NewTaskListComponent, {
      data: {
        title: '新建列表名称'
      }
    });
  }

  handleMove(srcData, list) {
    switch (srcData.tag) {
      case 'task-item':
        console.log('task-item', srcData);
        break;
      case 'task-list':
        console.log('task-list', srcData);
        const srcList = srcData.data;
        const tempOrder = srcList.order;
        srcList.order = list.order;
        list.order = tempOrder;
        break;
      default:
        console.log('什么都没有');
    }
  }
  handleQuicTask(desc: string) {
    console.log(desc);
  }
}
