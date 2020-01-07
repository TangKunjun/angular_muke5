import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export  interface DragData {
  tag: string;   //  多级拖拽，所以要区分那一级拖拽
  data: any;     //  传递的数据
}
@Injectable()
export class DragDropService {

  // 总是能保存上一个数据的值
  private _dragData = new BehaviorSubject<DragData>(null);

  // 存储数据
  setDragData(data: DragData) {
    this._dragData.next(data);
  }

  // 获取数据
  getDragData(): Observable<DragData> {
    return this._dragData.asObservable();
  }

  // 清空数据
  clearDragData() {
    this._dragData.next(null);
  }
  constructor() { }
}
