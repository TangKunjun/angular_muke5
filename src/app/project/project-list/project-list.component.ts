import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {NewProjectComponent} from '../new-project/new-project.component';
import {InviteComponent} from '../invite/invite.component';
import {ConfirmDialogComponent} from '../../shard/confirm-dialog/confirm-dialog.component';
import {slideToRight} from '../../anims/router.anim';
import {listAnimation} from '../../anims/list.anim';
import {ProjectService} from "../../services/project.service";
import * as _ from 'lodash';
import {filter, map, mapTo, switchMap, take} from "rxjs/operators";
import {Project} from "../../domain";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  animations: [slideToRight, listAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit, OnDestroy{

  @HostBinding('@routeAnim') state;
  sub: Subscription;
  projects = [];
  constructor(private dialog: MatDialog, private cd: ChangeDetectorRef,
              private service$: ProjectService) { }

  ngOnInit() {
    this.sub = this.service$.get('1').subscribe(project => {
      this.projects = project;

      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  openNewProjectDialog() {
   const selectImg = '/assets/img/covers/' + Math.floor(Math.random() * 40) + '_tn.jpg';
   const dialogRef =   this.dialog.open(NewProjectComponent, {
      data: {
        title: '新增项目',
        thumbnails: this.getThumbnails(),
        img: selectImg
      }
    });

   dialogRef.afterClosed().pipe(
       take(1),
       filter(v => v),
       map(v => ({...v, coverImg: this.buildImgStr(v.coverImg)})),
       switchMap((v: any) => this.service$.add(v))
   ).subscribe(v => {
     this.projects = [...this.projects, v];
     this.cd.markForCheck();
   });
   //     .subscribe(project => {    // 两个流不嵌套用switchMap合并流拍扁
   //   this.service$.add(project);
   //   this.cd.markForCheck();
   // });
  }

  launchInviteDialog() {
    const dialogRef =   this.dialog.open(InviteComponent, {
        data: {
            members: []
        }
    });
    dialogRef.afterClosed().subscribe(v => {
        if (v) {
            console.log(v)
        }
    })
  }

  launchUpdateDialog(project: Project) {
      const dialogRef =   this.dialog.open(NewProjectComponent, {
          data: {
              title: '新增项目',
              thumbnails: this.getThumbnails(),
              project
          }
      });

      dialogRef.afterClosed().pipe(
          take(1),
          filter(v => v),
          map(v => ({...v, id: v.id, coverImg: this.buildImgStr(v.coverImg)})),
          switchMap((v: any) => this.service$.update(v))
      ).subscribe(v => {
          const index = this.projects.map(value => value.id).indexOf(v.id);
          this.projects = [...this.projects.slice(0, index), v, ...this.projects.slice(index + 1)];
          this.cd.markForCheck();
      });
  }

  launchRemoveDialog(project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '删除确认',
        content: '是否删除该项目？'
      }
    });
    dialogRef.afterClosed().pipe(
        take(1),
        filter(v => v),
        mapTo(project),
        switchMap((v: any) => this.service$.del(v))
    ).subscribe(v => {
        this.projects = this.projects.filter(p => v.id !== p.id);
        this.cd.markForCheck();
    });
  }


  getThumbnails() {  // 生成一个从0到40的数组
    return _.range(0, 40).map(value => '/assets/img/covers/' + value + '_tn.jpg');
  }

  buildImgStr(img: string): string {
    return img.indexOf('_') > -1 ? img.split('_')[0] + '.jpg' : img;
  }

}
