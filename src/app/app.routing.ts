import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/*import { EnvService } from "./shared/env.service";*/
import {NotFoundComponent} from "./not-found/not-found.component";

const appRoutes: Routes =
[
  {path: '', loadChildren: 'app/top/top.module#TopModule',data:{pageTitle: 'Top Module'}},
  {path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule',data:{pageTitle: 'Admin Module'}},
  //page
  { path: 'page', loadChildren: 'app/page/page.module#PageModule' ,data:{pageTitle: 'Forgot Password'}},
  /*{path: '**', component: NotFoundComponent, pathMatch: 'full'}*/
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    /*EnvService*/
  ]
})
export class AppRoutingModule {}
