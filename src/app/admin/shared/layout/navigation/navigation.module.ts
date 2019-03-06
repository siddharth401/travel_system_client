

import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {BigBreadcrumbsComponent} from "./big-breadcrumbs.component";
import {MinifyMenuComponent} from "./minify-menu.component";
import {NavigationComponent} from "./navigation.component";
import {SmartMenuDirective} from "./smart-menu.directive";
import {UserModule} from "../../user/user.module";
import {RouterModule} from "@angular/router";
import {FlashComponent} from "../../flash/flash.component";
import {SharedModule} from "../../../../shared/shared.module";
// import {ChatModule} from "../../chat/chat.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UserModule,
    SharedModule
    // ChatModule
  ],
  declarations: [
    BigBreadcrumbsComponent,
    MinifyMenuComponent,
    NavigationComponent,
    SmartMenuDirective,
    FlashComponent
  ],
  exports: [
    BigBreadcrumbsComponent,
    MinifyMenuComponent,
    NavigationComponent,
    SmartMenuDirective,
    FlashComponent
  ]
})
export class NavigationModule{}
