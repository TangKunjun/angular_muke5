import {NgModule, Optional, SkipSelf} from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {loadSvgResources} from '../utils/svg.utils';
import {ShardModule} from '../shard/shard.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from "../app.routing.module";
import {ServicesModule} from '../services/services.module';
import '../utils/debug.utils';
import {AppStoreModule} from "../reducers";


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
  ],
  imports: [
    ShardModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServicesModule.footRoot(),
    AppStoreModule
  ],
    providers: [
        {
          provide: 'BASE_CONFIG', useValue: {
            uri: 'http://localhost:3000'
          }
        }
    ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AppRoutingModule,
    BrowserAnimationsModule,
  ]
})
export class CoreModule {
  constructor(
    @Optional() @SkipSelf() parent: CoreModule,
    ir: MatIconRegistry,
    ds: DomSanitizer
    ) {
    if (parent) {
      throw new Error('core模块已经加载过');
    }


    loadSvgResources(ir, ds);
  }
}
