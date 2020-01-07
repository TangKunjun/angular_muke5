import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {CoreModule} from './core/core.module';
import {HttpClientModule} from '@angular/common/http';
import {ProjectModule} from './project/project.module';
import {TaskModule} from './task/task.module';
import {ShardModule} from "./shard/shard.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    HttpClientModule,
    ProjectModule,
    TaskModule,
    ShardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
