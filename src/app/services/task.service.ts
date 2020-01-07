import {Inject, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Project, Task, TaskList} from "../domain";
import {count, map, mapTo, mergeMap, reduce, switchMap} from "rxjs/operators";
import {concat, from, Observable} from "rxjs";

@Injectable()
export class TaskService {
    private readonly domain = 'task';
    private header = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    constructor(private http: HttpClient, @Inject('BASE_CONFIG') private config) {}

    add(task: Task): Observable<Task> {
        task.id = null;
        const uir = this.config.uri + '/' + this.domain;
        return this.http.post(uir, JSON.stringify(task), {headers: this.header}).pipe(
            map(res => res as Task)
        );
    }

    update(task: Task): Observable<Task> {
        task.id = null;
        const uir = this.config.uri + '/' + this.domain + '/' + task.id;
        const toUpdate = {
            desc: task.desc,
            priority: task.priority,
            dueDate: task.dueDate,
            reminder: task.reminder,
            ownerId: task.ownerId,
            participantIds: task.participantIds,
            remark: task.remark
        };
        return this.http.patch(uir, toUpdate, {headers: this.header}).pipe(
            map(res => res as Task)
        );
    }

    // 删除
    del(task: Task): Observable<Task> {
        const uri = this.config.uri + '/' + this.domain + '/' + task.id;
        return this.http.delete(uri).pipe(
            mapTo(task)
        );
    }

    // GET
    get(taskListId: string): Observable<Task[]> {
        const uir = this.config.uri + '/' + this.domain;
        return this.http.get(uir, {params: {members_like: taskListId}}).pipe(
            map(res => res as Task[])
        );
    }

    // 获取在项目页面的时候的task
    getByLists(lists: TaskList[]): Observable<Task[]> {
        return from(lists).pipe(
            mergeMap(list => this.get(list.id)),
            reduce((tasks: Task[], t: Task[]) => [...tasks, ...t], [])
        );
    }

    // 完成任务和未完成任务
    complete(task: Task): Observable<Task> {
        const uir = this.config.uri + '/' + this.domain + '/' + task.id;

        return this.http.patch(uir, {completed: !task.completed}, {headers: this.header}).pipe(
            map(res => res as Task)
        );
    }

    // 完成任务和未完成任务
    completes(task: Task): Observable<Task> {
        const uir = this.config.uri + '/' + this.domain + '/' + task.id;

        return this.http.patch(uir, {completed: !task.completed}, {headers: this.header}).pipe(
            map(res => res as Task)
        );
    }

    // 移动
    move(taskId: string, taskListId: string): Observable<Task> {
        const uri = this.config.uri + '/' + this.domain + '/' + taskId;
        return this.http
            .patch(uri, JSON.stringify({taskListId}), {headers: this.header}).pipe(
            map(res => res as Task)
        );
    }

    // 移动所有
    moveAll(srcListId: string, targetListId: string): Observable<Task[]> {
        return this.get(srcListId).pipe(
            mergeMap(tasks => from(tasks)),
            mergeMap((task: Task) => this.move(task.id, targetListId)),
            reduce((arrs: Task[], x: Task) => [...arrs, x], [])
        );

    }
}
