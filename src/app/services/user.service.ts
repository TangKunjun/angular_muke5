import {Inject, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {count, filter, map, mapTo, mergeMap, reduce, switchMap} from "rxjs/operators";
import {from, Observable, of} from "rxjs";
import {Project, User} from "../domain";

@Injectable()
export class UserService {
    private readonly domain: string = 'users';
    private header = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    constructor(private http: HttpClient, @Inject('BASE_CONFIG') private config) {}

    // 根据输入邮箱时前几个字符联想出其他的
    searchUsers(fit: string): Observable<User[]> {
        const uir = this.config.uri + '/' + this.domain;
        return this.http.get(uir, {params: { email_like: fit}}).pipe(
            map(res => res as User[])
        );
    }

    // 根据项目Id寻找User
    getUsersByProject(projectId: string): Observable<User[]> {
        const uir = this.config.uri + '/' + this.domain;
        return this.http.get(uir, {params: {project_id: projectId}}).pipe(
            map(res => res as User[])
        );
    }

    // 用户加入某项目
    addProjectRef(user: User, projectId: string): Observable<User> {
        const uir = `${this.config.uri}/${this.domain}/${user.id}`;
        const projectIds = user.projectIds ? user.projectIds : [];

        if (projectIds.indexOf(projectId) > -1) {
            return of(user);
        }

        return this.http.patch(uir, JSON.stringify({projectIds: [...projectIds, projectId]}), {headers: this.header}).pipe(
            map(res => res as User)
        );
    }

    // 用户移除某项目
    removeProjectRef(user: User, projectId: string): Observable<User> {
        const uir = `${this.config.uri}/${this.domain}/${user.id}`;
        const projectIds = user.projectIds ? user.projectIds : [];
        const index = projectIds.indexOf(projectId);
        if ( index === -1) {
            return of(user);
        }
        const toUpate = [...projectIds.slice(0, index), ...projectIds.slice(index + 1)];
        return this.http.patch(uir, JSON.stringify({projectIds: toUpate}), {headers: this.header}).pipe(
            map(res => res as User)
        );
    }

    // 批量处理
    batchUpdateProjectRef(project: Project): Observable<User[]> {
        const projectId = project.id;
        const memberIds = project.members ? project.members : [];
        return from(memberIds).pipe(            // 将项目中的UserId集合转换成流
            switchMap(id => {
                const uir = `${this.config.uri}/${this.domain}/${id}`;
                return this.http.get(uir).pipe(         // 通过ID获取每一个user的信息
                    map(v => v as User)
                );
            }),
            filter((user: User) => user.projectIds.indexOf(projectId) === -1),  // 过滤项目中有的User
            switchMap((u: User) => this.addProjectRef(u, projectId)),   // 将每个用户都加入到指定的项目
            reduce((arr: User[], curr: User) => [...arr, curr], [])             // 将返回的用户流转成数组
        );
    }
}
