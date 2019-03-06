import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SmartadminModule} from "../shared/smartadmin.module";
import {FormComponent} from "./form.component";
import {SharedModule} from "../../shared/shared.module";
import {ListComponent} from "./list.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MemberRouting} from "./member.routing";
import {AuthServiceConfig, FacebookLoginProvider, SocialLoginModule} from "angular4-social-login";
import {environment} from "../../../environments/environment.prod";


let config = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(environment.facebook_id)
  }
]);

export function provideConfig() {
  return config;
}


@NgModule({
  imports: [
    CommonModule,
    MemberRouting,
    SmartadminModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule
  ],
  declarations: [ListComponent,FormComponent],
  providers:
      [
        {
          provide: AuthServiceConfig,
          useFactory: provideConfig
        }
      ]
})
export class MemberModule {}
