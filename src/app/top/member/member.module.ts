import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {memberRouting} from "./member.routing";
import {MemberComponent} from "./member.component";
import {MemberAddComponent} from "./member-add/member-add.component";
import {MemberAddCompletionComponent} from "./member-add/completion/completion.component";
import {MemberLoginComponent} from "./member-login/member-login.component";
import {MemberLogoutComponent} from "./member-logout/logout.component";
import {ReminderComponent} from "./reminder/reminder.component";
import {SharedModule} from "../../shared/shared.module";
import {ReminderCompletionComponent} from "./reminder-completion/reminder-completion.component";
import { SocialLoginModule, AuthServiceConfig } from "angular4-social-login";
import { FacebookLoginProvider } from "angular4-social-login";
import {environment} from "../../../environments/environment.prod";
import {MemberLogoutAllComponent} from "./member-logout-all-device/logout-all.component";

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
    memberRouting,
    SharedModule,
    SocialLoginModule
  ],
  declarations: [
    MemberComponent,
    MemberAddComponent,
    MemberLoginComponent,
    ReminderComponent,
    ReminderCompletionComponent,
    MemberLogoutComponent,
    MemberAddCompletionComponent,
    MemberLogoutAllComponent
  ],
  providers:
  [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ]



})
export class MemberModule {}
