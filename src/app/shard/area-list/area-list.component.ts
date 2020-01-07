import {ChangeDetectionStrategy, Component, forwardRef, OnDestroy, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Address} from "../../domain";
import {combineLatest, Observable, of, Subject, Subscription} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {getAreaByCity, getCitysByProvice, getProvices} from "../../utils/area.util";

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.scss'],
  providers: [
      {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => AreaListComponent),
          multi: true
      },
      {
          provide: NG_VALIDATORS,
          useExisting: forwardRef(() => AreaListComponent),
          multi: true
      }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaListComponent implements OnInit, OnDestroy, ControlValueAccessor {

    address: Address = {
      provice: '',
      city: '',
      district: '',
      street: ''
    };

    provice = new Subject();
    city = new Subject();
    district = new Subject();
    street = new Subject();
    provices$: Observable<string[]>;
    citys$: Observable<string[]>;
    districts$: Observable<string[]>;
    street$: Observable<string>;
    sub: Subscription;

    private propagateChange = (_: any) => {};

    constructor() { }

    ngOnInit() {
      const provice$ = this.provice.asObservable().pipe(startWith(''));
      const city$ = this.city.asObservable().pipe(startWith(''));
      const district$ = this.district.asObservable().pipe(startWith(''));
      const street$ = this.street.asObservable().pipe(startWith(''));

      const val$ = combineLatest([provice$, city$, district$, street$], (p, c, d, s) => {
        return {
          provice: p,
          city: c,
          district: d,
          street: s
        };
      });

      this.sub = val$.subscribe(v => this.propagateChange(v));
      this.provices$ = of(getProvices());

      this.citys$ = provice$.pipe(map((value: string) => getCitysByProvice(value)));
      this.districts$ = combineLatest([provice$, city$], (p: string, c: string) => getAreaByCity(p, c));

    }

    onProviceChange() {
      this.provice.next(this.address.provice);
    }
    onCityChange() {
      this.city.next(this.address.city);
    }
    onDistrictChange() {
      this.district.next(this.address.district);
    }
    onStreetChange() {
      this.street.next(this.address.street);
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState(isDisabled: boolean): void {
    }

    writeValue(obj: Address): void {
      if (obj) {
          this.address = obj;
          if (this.address.provice) {
            this.provice.next(this.address.provice);
          }
          if (this.address.district) {
            this.district.next(this.address.district);
          }
          if (this.address.city) {
            this.city.next(this.address.city);
          }
          if (this.address.street) {
              this.street.next(this.address.street);
          }
      }
    }

    validate(c: FormControl): {[key: string]: any} {
        const val = c.value;
        if (!val) {
            return null;
        }
        if (val.provice && val.city && val.district && val.street) {
          return null;
        }
        return {
          addressInvalid: true
        };
    }

    ngOnDestroy(): void {
      if (this.sub) {
        this.sub.unsubscribe();
      }
    }
}
