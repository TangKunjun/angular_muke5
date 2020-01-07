import {Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2} from '@angular/core';
import {DragData, DragDropService} from '../drag-drop.service';

import {take} from 'rxjs/operators';

@Directive({
  selector: '[appDroppable]'
})
export class DropDirective {

  @Input() dragEnterClass: string;
  @Input() dropTags: string[] = [];  // 对于被放置的区域来说，拖拽的元素可以是多个所以用数组
  @Output() droped = new EventEmitter<DragData>();
  private data$;

  constructor(private el: ElementRef, private rd: Renderer2, private service: DragDropService) {
    this.data$ = this.service.getDragData().pipe(
      take(1)
    );
  }

  // 拖拽进入到元素领域触发
  @HostListener('dragenter', ['$event'])
  onDragEnter(ev: Event) {
    if (this.el.nativeElement === ev.target) {
      this.data$.subscribe(dragData => {      //  拖拽传递过来的数据
        if (this.dropTags.indexOf(dragData.tag) > -1) {  //  拖拽元素是否在数组中
          this.rd.addClass(this.el.nativeElement, this.dragEnterClass);
        }
      });
    }
  }

  // 拖拽元素在元素上
  @HostListener('dragover', ['$event'])
  onDragOver(ev: Event) {
    ev.stopPropagation();
    ev.preventDefault();
    if (this.el.nativeElement === ev.target) {
      this.data$.subscribe(dragData => {
        if (this.dropTags.indexOf(dragData.tag) > -1) {
          this.rd.setProperty(ev, 'dataTransfer.effectAllowed', 'all');  // 运行特效
          this.rd.setProperty(ev, 'dataTransfer.dropEffect', 'move');
        } else {
          this.rd.setProperty(ev, 'dataTransfer.effectAllowed', 'none');
          this.rd.setProperty(ev, 'dataTransfer.dropEffect', 'noe');
        }
      });
    }
  }

  // 拖拽元素离开元素领域触发
  @HostListener('dragleave', ['$event'])
  onDragLeave(ev: Event) {
    if (this.el.nativeElement === ev.target) {
      this.data$.subscribe(dragData => {
        if (this.dropTags.indexOf(dragData.tag) > -1) {
          this.rd.removeClass(this.el.nativeElement, this.dragEnterClass);
        }
      });
    }
  }
  // 拖拽释放
  @HostListener('drop', ['$event'])
  onDrop(ev: Event) {
    ev.stopPropagation();
    ev.preventDefault();
    if (this.el.nativeElement === ev.target) {
      this.data$.subscribe(dragData => {
        if (this.dropTags.indexOf(dragData.tag) > -1) {
          this.rd.removeClass(this.el.nativeElement, this.dragEnterClass);
          this.droped.emit(dragData);
          this.service.clearDragData();
        }
      });
    }
  }

}
