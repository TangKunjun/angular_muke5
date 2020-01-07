import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-task-header',
  templateUrl: './task-header.component.html',
  styleUrls: ['./task-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskHeaderComponent implements OnInit {

  @Input() header: string;
  @Output() moveAll = new EventEmitter();
  @Output() newTask = new EventEmitter();
  @Output() remove = new EventEmitter();
  @Output() editList = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onNewTaskClick() {
    this.newTask.emit();
  }

  onMoveAllClick() {
    this.moveAll.emit();
  }
  onRemoveClick() {
    this.remove.emit();
  }
  onEditListClick() {
    this.editList.emit();
  }
}
