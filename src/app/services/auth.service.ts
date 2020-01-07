import {Inject, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Project, User} from "../domain";
import {count, map, mapTo, mergeMap, switchMap} from "rxjs/operators";
import {from, Observable} from "rxjs";
import {Auth} from "../domain/auth.model";

@Injectable()
export class AuthService {
    private readonly domain = 'users';
    private header = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    private token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
        '.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9' +
        '.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';

    constructor(private http: HttpClient, @Inject('BASE_CONFIG') private config) {}

    // 注册
    register(user: User): Observable<Auth> {
        user.id = null;
        const uir = this.config.uri + '/' + this.domain;
        return this.http
            .get(uir, {params: {email: user.email}}).pipe(
                switchMap((res: any) => {
                    if (res.length > 0) {
                        throw "用户已注册";
                    }
                    return this.http.post(uir, JSON.stringify(user), {headers: this.header}).pipe(
                        map((r: User) => ({token: this.token, user: r})));
                })
        );
    }

    // 登录
    login(userName: string, password: string): Observable<Auth> {
        const uir = this.config.uri + '/' + this.domain;
        return this.http.get(uir, {params: {email: userName, password}}).pipe(
            map((res: any) => {
                if (res.length === 0) {
                    throw "用户名或密码错误";
                }
                return {
                    token: this.token,
                    user: res[0]
                };
            })
        );
    }
}
