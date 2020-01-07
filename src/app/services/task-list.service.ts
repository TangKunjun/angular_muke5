import {Inject, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Project, TaskList} from "../domain";
import {count, map, mapTo, mergeMap, reduce, switchMap} from "rxjs/operators";
import {concat, from, Observable} from "rxjs";

@Injectable()
export class TaskListService {
    private readonly domain = 'taskList';
    private header = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    constructor(private http: HttpClient, @Inject('BASE_CONFIG') private config) {}

    add(taskList: TaskList): Observable<TaskList> {
        taskList.id = null;
        const uir = this.config.uri + '/' + this.domain;
        return this.http.post(uir, JSON.stringify(taskList), {headers: this.header}).pipe(
            map(res => res as TaskList)
        );
    }

    update(taskList: TaskList): Observable<TaskList> {
        taskList.id = null;
        const uir = this.config.uri + '/' + this.domain + '/' + taskList.id;
        const toUpdate = {
            name: taskList.name
        }
        return this.http.patch(uir, toUpdate, {headers: this.header}).pipe(
            map(res => res as TaskList)
        );
    }

    // 删除
    del(taskList: TaskList): Observable<TaskList> {
        const uri = this.config.uri + '/' + this.domain + '/' + taskList.id;
        return this.http.delete(uri).pipe(
            mapTo(taskList)
        );
    }

    // GET
    get(taskListId: string): Observable<TaskList[]> {
        const uir = this.config.uri + '/' + this.domain;
        return this.http.get(uir, {params: {members_like: taskListId}}).pipe(
            map(res => res as TaskList[])
        );
    }

    // 拖动换列表顺序
    swapOrder(src: TaskList, target: TaskList): Observable<TaskList[]> {
        const dragUri = this.config.uri + '/' + this.domain + '/' + src.id;
        const dropUri = this.config.uri + '/' + this.domain + '/' + target.id;
        const drag$ = this.http.patch(dragUri, JSON.stringify({order: target.order}), {headers: this.header})
        const drop$ = this.http.patch(dropUri, JSON.stringify({order: src.order}), {headers: this.header})
        return concat(drag$, drop$).pipe(
            reduce((arrs, list) => [...arrs, list], [])
        );
    }
}
