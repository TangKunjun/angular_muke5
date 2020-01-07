import {ChangeDetectionStrategy, Component, forwardRef, OnDestroy, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Identity, IdentityType} from "../../domain";
import {combineLatest, Observable, Subject, Subscription} from "rxjs";


@Component({
  selector: 'app-identity-input',
  templateUrl: './identity-input.component.html',
  styleUrls: ['./identity-input.component.scss'],
  providers: [
      {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => IdentityInputComponent),
          multi: true
      },
      {
          provide: NG_VALIDATORS,
          useExisting: forwardRef(() => IdentityInputComponent),
          multi: true
      }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IdentityInputComponent implements OnInit, OnDestroy, ControlValueAccessor {

  sub: Subscription;
  identityType = [
      {value: IdentityType.IdCard, label: '身份证'},
      {value: IdentityType.Insurance, label: '医保'},
      {value: IdentityType.Passport, label: '护照'},
      {value: IdentityType.Military, label: '军官证'},
      {value: IdentityType.Other, label: '其他'},
  ];

  identity: Identity = {identityType: null, identityNo: null};
  private idType$ = new Subject<IdentityType>();
  private idNo$ = new Subject<string>();

  private propagateChange = (_: any) => {};

  constructor() { }

  ngOnInit() {
    const val$ = combineLatest(this.idType, this.idNo, ( type, no) => {
      return {
          identityType: type,
          identityNo: no
      };
    });

    this.sub =  val$.subscribe(id => {
      this.propagateChange(id);
    });
  }

  onIdTypeChange(idType: IdentityType) {
    this.idType$.next(idType);
  }
  onIdNoChange(idNo: string) {
    this.idNo$.next(idNo);
  }

  get idType(): Observable<IdentityType> {
    return this.idType$.asObservable();
  }

  get idNo(): Observable<string> {
    return this.idNo$.asObservable();
  }

  writeValue(obj: any): void {
    if (obj) {
      this.identity = obj;
    }
  }

  registerOnChange(fn: any): void {
      this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  validate(c: FormControl): {[key: string]: any} {
      const val = c.value;
      if (!val) {
          return null;
      }
      switch (val.identityType) {
          case IdentityType.IdCard: {
              console.log(this.validateIdCard(c));
              return this.validateIdCard(c);
          }
                                    break;
          case IdentityType.Military: {
              return this.validateMilitary(c);
          }
                                    break;
          case IdentityType.Passport: {
              return this.validatePassport(c);
          }
                                    break;
          case IdentityType.Insurance:
          default: {
              return null;
          }
      }
  }

  // 身份证验证
  validateIdCard(c: FormControl): {[key: string]: any} {
      const val = c.value.identityNo;
      if (val.length !== 18) {
          return {idInvalid: true};
      }
      const pattern = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}[x0-9]$/;
      return pattern.test(val) ? null : {idNotInvalid: true};
  }

  // 护照
  validatePassport(c: FormControl): {[key: string]: any} {
      const val = c.value.identityNo;
      if (val.length !== 9) {
          return {passportInvalid: true};
      }
      const pattern = /^[Gg|Ee]\d{8}$/;
      return pattern.test(val) ? null : {idNotInvalid: true};
  }

  // 军官证
  validateMilitary(c: FormControl): {[key: string]: any} {
      const val = c.value.identityNo;
      const pattern = /[\u4e00-\u9fa5](字第)(\d{4,8})(号?)$/;
      return pattern.test(val) ? null : {idNotInvalid: true};
  }




  ngOnDestroy(): void {
    if (this.sub) {
        this.sub.unsubscribe();
    }
  }
}
