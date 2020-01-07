import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-image-list-select',
  templateUrl: './image-list-select.component.html',
  styleUrls: ['./image-list-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageListSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ImageListSelectComponent),
      multi: true
    }
  ]
})
export class ImageListSelectComponent implements ControlValueAccessor, OnInit {

  @Input() title = '选择';
  @Input() cols: number;
  @Input() rowHeight = '64px';
  @Input() items = [];
  @Input() useSvgIcon = false;
  @Input() itemWidth = '80px';
  selected: string;

  private propagateChange = (_: any) => {};
  constructor() { }

  ngOnInit() {
  }

  onChange(i) {
    this.selected = this.items[i];
    this.propagateChange(this.selected);
  }


  // 表单值写入进来
  writeValue(obj: any): void {
    this.selected = obj;
  }
  // 表单值发生变化
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  // 表单进入进出
  registerOnTouched(fn: any): void {}

  // 表单设置禁用
  setDisabledState(isDisabled: boolean): void {
  }

  validate(c: FormControl): {[key: string]: any} {
    return this.selected ? null : {
      imageListInvalid: {
        valid: false
      }
    };
  }
}
