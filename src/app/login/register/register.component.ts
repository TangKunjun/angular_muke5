import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {debounceTime, filter} from "rxjs/operators";
import {Subscription} from "rxjs";
import {extractInfo, isValidAddr, getAddrByCode} from "../../utils/identity.util"
import {isValidDate} from '../../utils/date.util';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  form: FormGroup;
  items: string[];
  private readonly avatarName = 'avatars';
  sub: Subscription;
  constructor(private fb: FormBuilder) { }
  ngOnInit() {
    const img = `${this.avatarName}:svg-${Math.floor(Math.random() * 16).toFixed(0)}`;
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    this.items = nums.map(d => `avatars:svg-${d}`);  // avatars是一个集合体 svg-num是svg里面每一个图片的id
    this.form = this.fb.group({
      email: [''],
      name: [],
      password: [],
      repeat: [],
      avater: [img],
      dateOfBirth: ['1990-01-01'],
      identity: [],
      address: []
    });

    const id$ = this.form.get('identity').valueChanges.pipe(
        debounceTime(300),
        filter(_ => this.form.get('identity').valid)
    );
    this.sub = id$.subscribe((id) => {
      const info = extractInfo(id.identityNo);
      if (isValidAddr(info.addrCode)) {
        const  addr = getAddrByCode(info.addrCode);
        this.form.get('address').patchValue(addr);
      }
      if (isValidDate(info.dateOfBirth)) {
        this.form.get('dateOfBirth').patchValue(info.dateOfBirth);
      }
    });
  }


  onSubmit({value, valid}, ev: Event) {
    ev.preventDefault();
    if (!valid) {
      return;
    }
    console.log(value);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
