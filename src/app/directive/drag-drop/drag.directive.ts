// 拖


import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';
import {DragDropService} from '../drag-drop.service';

@Directive({
  selector: '[appDraggable]'
})
export class DragDirective {

  private _isDraggble = false;

  @Input('appDraggable')
  set isDraggble(val: boolean) {   // 这个方法就是使用指令的时候appDraggable ='true'调用
    this._isDraggble = val;
    this.rd.setAttribute(this.el.nativeElement, 'draggable' , `${val}`);  // 规定必须赋属性
  }

  get isDraggble() {
    return this._isDraggble;
  }


  @Input() draggedClass: string;
  @Input() dragTag: string;  // 唯一标识
  @Input() dragData: any;   // 传递的数据
  constructor(
    private el: ElementRef,
    private rd: Renderer2,
    private service: DragDropService
  ) { }

  // 拖拽开始
  @HostListener('dragstart', ['$event'])
  onDragStart(ev: Event) {
    if (this.el.nativeElement === ev.target) {
      this.rd.addClass(this.el.nativeElement, this.draggedClass);
      this.service.setDragData({
        tag: this.dragTag,
        data: this.dragData
      });
    }
  }


  // 拖拽结束
  @HostListener('dragend', ['$event'])
  onDragEnd(ev: Event) {
    if (this.el.nativeElement === ev.target) {
      this.rd.removeClass(this.el.nativeElement, this.draggedClass);
    }
  }
}
