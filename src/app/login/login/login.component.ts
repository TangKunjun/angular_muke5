import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {QuoteService} from '../../services/quote.service';
import {Quote} from '../../domain/quote.model';
import {Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import * as fromRoot from '../../reducers';
import * as actions from '../../actions/quote.action';
import {reducer} from "../../reducers";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  quote$: Observable<Quote>;
  constructor(
      private fb: FormBuilder,
      private quoteService$: QuoteService,
      private store$: Store<fromRoot.State>
  ) {
    this.quote$ = this.store$.pipe(select((state: any) =>  fromRoot.getQuote(state.reducer)));  // 得到最新的状态
    this.quoteService$.getQuote().subscribe(val => {
      this.store$.dispatch(new actions.LoadSuccessAction(val));  // 发送状态
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['123@qq.com', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.form.controls.email.setValidators(this.validate);
  }

  onSubmit(data, ev: Event) {
    ev.stopPropagation();
    console.log(data );
  }


  // 自定义校验器

  validate(c: FormControl): {[key: string]: any} {
    if (!c.value) {
      return  null;
    }
    const pattern = /^tang+/;
    if (pattern.test(c.value)) {
      return null;
    }
    return {
      emailNotValid: '邮件必须以tang开头'
    };
  }
}
