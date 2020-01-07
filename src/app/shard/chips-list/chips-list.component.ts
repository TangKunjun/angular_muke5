import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {
    ControlValueAccessor,
    FormBuilder,
    FormControl,
    FormGroup,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR
} from '@angular/forms';
import {User} from '../../domain';
import {Observable} from 'rxjs';
import {isValidDate} from '../../utils/date.util';
import {debounceTime, distinctUntilChanged, filter, switchMap} from "rxjs/operators";
import {UserService} from "../../services/user.service";
@Component({
  selector: 'app-chips-list',
  templateUrl: './chips-list.component.html',
  styleUrls: ['./chips-list.component.scss'],
  providers: [
      {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => ChipsListComponent),
          multi: true
      },
      {
          provide: NG_VALIDATORS,
          useExisting: forwardRef(() => ChipsListComponent),
          multi: true
      }
  ]
})
export class ChipsListComponent implements OnInit, ControlValueAccessor {

  @Input() multiple = true;
  @Input() placeholderText = '请输入成员 email';
  @Input() label = '添加/修改成员';
  form: FormGroup;
  items: User[] = [];
  memberResults$: Observable<User[]>;
  private propagateChange = (_: any) => {};

  constructor(private fb: FormBuilder, private service: UserService) { }

  ngOnInit() {
    this.form = this.fb.group({
        memberSearch: ['']
    });
    this.memberResults$ = this.form.get('memberSearch').valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(v => v && v.length > 1),
        switchMap(v => this.service.searchUsers(v))
    );
  }
// 表单值写入进来
    writeValue(obj: User[]): void {
      if (!obj) {return ; }
      if (this.multiple) {
        const userEntities = obj.reduce((e, c) => ({...e,  c}), {});
        if (this.items) {
          const remaining = this.items.filter(item => !userEntities[item.id]);
          this.items = [...remaining, ...obj];

        } else {
          this.items = [...obj];
        }
      }
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

    // 验证
    validate(c: FormControl): {[key: string]: any} {
        return this.items.length ? null : {
          chipListInvalid: true
        };
    }

    removeMember(member: User) {
       const ids = this.items.map(item => item.id);
       const i = ids.indexOf(member.id);
       if (this.multiple) {
          this.items = [...this.items.slice(0, i), ...this.items.slice(i + 1)];
       } else {
          this.items = [];
       }
       this.form.patchValue({memberSearch: ''});
       this.propagateChange(this.items);
    }

    handleMemberSelection(member: User) {
      if (this.items.map(item => item.id).indexOf(member.id) !== -1) {
        return;
      }
      this.items = this.multiple ? [...this.items, member] : [member];
      this.form.patchValue({memberSearch: member, name});
      this.propagateChange(this.items);
    }

    displayUser(user: User): string {
      return user ? user.name : '';
    }

    get displayInput() {
      return this.multiple || this.items.length !== 0;
    }
}
