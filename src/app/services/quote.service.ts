import {Inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Quote} from "../domain/quote.model";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";


@Injectable()
export class QuoteService {
    constructor(private http: HttpClient, @Inject('BASE_CONFIG') private config) {}
    getQuote(): Observable<Quote> {
        const uri = `${this.config.uri}/quotes/${Math.floor(Math.random() * 10)}`;
        return this.http.get(uri).pipe(
            // debug('quote').
            map(res => res as Quote)
        );
    }
}
