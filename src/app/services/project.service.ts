import {Inject, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Project} from "../domain";
import {count, map, mapTo, mergeMap, switchMap} from "rxjs/operators";
import {from, Observable} from "rxjs";

@Injectable()
export class ProjectService {
    private readonly domain = 'projects';
    private header = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    constructor(private http: HttpClient, @Inject('BASE_CONFIG') private config) {}

    add(project: Project): Observable<Project> {
        project.id = null;
        const uir = this.config.uri + '/' + this.domain;
        return this.http.post(uir, JSON.stringify(project), {headers: this.header}).pipe(
            map(res => res as Project)
        );
    }

    update(project: Project): Observable<Project> {
        const uir = this.config.uri + '/' + this.domain + '/' + project.id;
        const toUpdate = {
            name: project.name,
            desc: project.desc,
            coverImg: project.coverImg
        }
        return this.http.patch(uir, toUpdate, {headers: this.header}).pipe(
            map(res => res as Project)
        );
    }

    // 删除
    del(project: Project): Observable<Project> {
        const delTask$ = from(project.taskList ? project.taskList : []).pipe(  // 删除项目的时候 进行项目下面的任务删除
            mergeMap(listId => this.http.delete(this.config.uri + '/taskLists/' + listId)),  // 拍扁操作
            count()
        );
        return delTask$.pipe(   // 任务删除完后再删除项目
            switchMap(_ => this.http.delete(this.config.uri + '/' + this.domain + '/' + project.id)), // 拍扁
            mapTo(project)
        );
    }

    get(userId: string): Observable<Project[]> {
        const uir = this.config.uri + '/' + this.domain;
        return this.http.get(uir, {params: {members_like: userId}}).pipe(
            map(res => res as Project[])
        );
    }
}
