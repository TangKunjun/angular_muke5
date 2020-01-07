import {Component, forwardRef, Input, OnDestroy, OnInit} from '@angular/core';
import {
    ControlValueAccessor,
    FormBuilder,
    FormControl,
    FormGroup,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR
} from '@angular/forms';
import {debounceTime, distinctUntilChanged, filter, map, startWith} from 'rxjs/operators';
import {combineLatest, merge, Subscription} from 'rxjs';
import {
    differenceInDays,
    differenceInMonths,
    differenceInYears,
    format,
    isBefore, isDate, isFuture, isValid,
    parse,
    subDays,
    subMonths, subYears
} from 'date-fns';
import {isValidDate} from '../../utils/date.util';

export enum  AgeUnit {
  Year = 0,
  Month,
  Day
}

export interface Age {
    age: number;
    unit: AgeUnit;  // 单位
}

@Component({
  selector: 'app-age-input',
  templateUrl: './age-input.component.html',
  styleUrls: ['./age-input.component.scss'],
  providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => AgeInputComponent),
        multi: true
    },
    {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => AgeInputComponent),
        multi: true
    }
  ]
})
export class AgeInputComponent implements ControlValueAccessor, OnInit, OnDestroy{
    @Input() daysTop = 90;
    @Input() daysBottom = 0;
    @Input() monthTop = 24;
    @Input() monthBottom = 1;
    @Input() yearsTop = 150;
    @Input() yearsBottom = 1;
    @Input() format = 'yyyy-MM-dd';
    @Input() debounceTime = 300;
    selectedUnit = AgeUnit.Year;
    ageUnits = [
      {value: AgeUnit.Year, label: '岁'},
      {value: AgeUnit.Month, label: '月'},
      {value: AgeUnit.Day, label: '天'},
  ];
  form: FormGroup;
  sub: Subscription;
  constructor(private fb: FormBuilder) { }


  private propagateChange = (_: any) => {};

  ngOnInit() {
    this.form = this.fb.group({
        birthday: ['', this.validateDate],
        age: this.fb.group(
            {
                    ageNum: [],
                    ageUnit: [AgeUnit.Year]
                 },
            { validator: this.validateAge('ageNum', 'ageUnit') }
        )
    });

    const birthday = this.form.get('birthday');
    const ageNum = this.form.get('age').get('ageNum');
    const ageUnit = this.form.get('age').get('ageUnit');

    const birthday$ = birthday.valueChanges.pipe(  // 输入出生日期的时候
        map(v => {
          return {date: v, from: 'birthday' };
        }),
        filter(value => this.form.get('birthday').valid),  // 过滤掉不合法的信息

    );

    const ageNum$ = ageNum.valueChanges.pipe( // 输入年龄
        startWith(ageNum.value),    //  流以ageNum.value 为主
        debounceTime(this.debounceTime),  // 输入后停顿300
        distinctUntilChanged()       // 相同的不发射
     );

    const ageUnit$ = ageUnit.valueChanges.pipe( // 选择单位
        startWith(ageUnit.value),    //  流以ageUnit.value 为主
        debounceTime(this.debounceTime),  // 输入后停顿300
        distinctUntilChanged()      // 相同的不发射
    );

    const age$ = combineLatest(ageNum$, ageUnit$, (n, u) => {  // 合并流 通过合并年龄与单位计算出生年月
      return this.toDate({age: n, unit: u});
    }).pipe(
        map(v => {
          return {date: v,  from: 'age'};
        }),
        filter(value => this.form.get('age').valid)    // 过滤不符合的年龄的流
    );

    const meged$ = merge(birthday$, age$).pipe(       // 合并流 得出结果，那个流发射出来就选择哪个流
        filter(value => this.form.valid)
    );

    this.sub = meged$.subscribe(d => {
      const age = this.toAge(d.date);
      if (d.from === 'birthday') {
        if (age.age !== ageNum.value) {
            ageNum.patchValue(age.age, {emitEvent: false});
        }
        if (age.unit !== ageUnit.value) {
            this.selectedUnit = age.unit;
            ageUnit.patchValue(age.unit, {emitEvent: false});
        }
        this.propagateChange(d.date);
      } else {
        const ageToCompare = this.toAge(birthday.value);
        if (age.age !== ageToCompare.age || age.unit !== ageToCompare.unit) {
          birthday.patchValue(d.date, {emitEvent: false});
          this.propagateChange(d.date);
        }
      }

    });
  }

  ngOnDestroy() {
    if (this.sub) {
        this.sub.unsubscribe();
    }
  }
    onChange(i) {

    }


    // 表单值写入进来
    writeValue(obj: any): void {
        if (obj) {
            const date = format(new Date(obj), this.format);
            this.form.get('birthday').patchValue(date);
            const age = this.toAge(date);
            this.form.get('age').get('ageNum').patchValue(age.age);
            this.form.get('age').get('ageUnit').patchValue(age.unit);
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

    toAge(dateStr: string): Age {  // 出生日期转年龄
      const date = new Date(dateStr);
      const now = Date.now();

      return isBefore(subDays(now, this.daysTop), date) ?                     // 如果在90天内
          {age: differenceInDays(now, date), unit: AgeUnit.Day} :           // 用天为单位
          isBefore(subMonths(now, this.monthTop), date) ?                      // 如果在24个月内
              {age: differenceInMonths(now, date), unit: AgeUnit.Month} :   // 用月为单位
              {age: differenceInYears(now, date), unit: AgeUnit.Year};      // 用年为单位
    }

    toDate(age: Age): string {  // 年龄转出生年月
      const now = Date.now();
      const dateFormat = this.format;
      switch (age.unit) {
          case AgeUnit.Year: {
              return format(subYears(now, age.age), dateFormat);
          }
          case AgeUnit.Month: {
              return format(subMonths(now, age.age), dateFormat);
          }
          case AgeUnit.Day: {
              return format(subDays(now, age.age), dateFormat);
          }
          default: {
              return null;
          }
      }
    }

    // 整个表单的验证
    validate(c: FormControl): {[key: string]: any} {
        const val = c.value;
        if (!val) {
            return null;
        }
        if (isValidDate(val)) {
            return null;
        }
        return {
            dateOfBirthInvalid: true
        };
    }

    // 出生日期校验
    validateDate(c: FormControl): {[key: string]: any} {
        const val = c.value;
        return isValidDate(val) ?  // 和当前的时间小于150年
            null : {
              birthdayInvalid: true
            };
    }

    // 年龄校验
    validateAge(ageNumKey: string, ageUnitKey: string) {
        return (group: FormGroup): {[key: string]: any}  => {
            const ageNum = group.controls[ageNumKey];
            const ageUnit = group.controls[ageUnitKey];

            let result = false;
            const ageNumVal = ageNum.value;
            switch (ageUnit.value) {
                case AgeUnit.Year: {
                    result = ageNumVal >= this.yearsBottom && ageNumVal < this.yearsTop; // 以年为单位的区间在1～150
                    break;
                }
                case AgeUnit.Month: {
                    result = ageNumVal >= this.monthBottom && ageNumVal < this.monthTop; // 以月为单位的区间在1～24
                    break;
                }
                case AgeUnit.Day: {
                    result = ageNumVal >= this.daysBottom && ageNumVal < this.daysTop; // 以日为单位的区间在1～90
                    break;
                }
                default: {
                    return null;
                }
            }
            return result ? null : {ageInvalid: true};
        };
    }
}
