import {NgModule} from '@angular/core';
import {AdminRoutingModule} from "./admin.routing";
import {CoreModule} from "./core/core.module";
import {SmartadminLayoutModule} from "./shared/layout/layout.module";
import {CommonModule} from "@angular/common";
import {AuthGuard} from "../shared/guards/auth-guard";
import {ConfirmationComponent} from "../top/suggestion/plan/confirmation.component";

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SmartadminLayoutModule,
    AdminRoutingModule,
  ],
  declarations: [],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    //ADMIN_PROVIDERS //,ComponentLoaderFactory
    AuthGuard
  ]
})

export class AdminModule {}