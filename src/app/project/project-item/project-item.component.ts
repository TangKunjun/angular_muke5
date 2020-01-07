import {Component, Input, OnInit, Output, EventEmitter, HostBinding, HostListener} from '@angular/core';
import {cardAnim} from "../../anims/card.anim";

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
  animations: [cardAnim]
})
export class ProjectItemComponent implements OnInit {

  @Input() item;
  @Output() onInvite = new EventEmitter<void> ();
  @Output() onEdit = new EventEmitter<void> ();
  @Output() onRemove = new EventEmitter<void> ();
  @HostBinding('@card') cardState = 'out';  // 把[@card] = 'cardState' 绑定到当前组件
  constructor() { }

  ngOnInit() {
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.cardState = 'hover';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
      this.cardState = 'out';
  }

  onInviteClick() {
    this.onInvite.emit();
  }
  onEditClick() {
    this.onEdit.emit();
  }
  onRemoveClick() {
    this.onRemove.emit();
  }
}
