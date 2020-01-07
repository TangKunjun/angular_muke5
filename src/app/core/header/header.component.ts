import {Component, EventEmitter, OnInit, Output} from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggle: EventEmitter<void> = new EventEmitter();
  @Output() toggleDarkTheme: EventEmitter<void> = new EventEmitter();
  constructor() {
  }

  ngOnInit() {
  }

  openSidebar() {
    this.toggle.emit();
  }

  onChange(checked) {
      this.toggleDarkTheme.emit(checked.checked);
  }

}
