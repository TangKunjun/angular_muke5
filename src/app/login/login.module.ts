import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import {LoginRoutingModule} from './login-routing.module';
import {ShardModule} from '../shard/shard.module';
import { RegisterComponent } from './register/register.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    ShardModule,
    LoginRoutingModule
  ],
  exports: [
    ShardModule,
    LoginRoutingModule,
  ]
})
export class LoginModule { }
