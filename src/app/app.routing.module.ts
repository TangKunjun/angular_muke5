import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


const rout: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', loadChildren: './login/login.module#LoginModule'},
  {path: 'project', redirectTo: '/project', pathMatch: 'full'},
  {path: 'tasklist', redirectTo: '/tasklist', pathMatch: 'full'}
]
@NgModule({
  imports: [
    RouterModule.forRoot(rout)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {

}
