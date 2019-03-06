import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "../../shared/shared.module";
import {MypageComponent} from "./mypage.component";
import {myPageRouting} from "./mypage.routing";
import {FavoritesComponent} from "./favorites/favorites.component";
import {MessageboxComponent} from "./messagebox/messagebox.component";
import {ProfileComponent} from "./profile/profile.component";
import {MailCompletationComponent} from "./profile/mail_completation/mail_completation.component";
import {MailSendComponent} from "./profile/mail_send/mail_send.component";
import {MailUpdateComponent} from "./profile/mail_update/mail_update.component";
import {ResumComponent} from "./profile/resum/resum.component";
import {RequestComponent} from "./profile/request/request.component";
import {UpdateComponent} from "./profile/update/update.component";
import {MypageMoneyComponent} from "./money/money.component";
import {FormsModule} from "@angular/forms";
import {FavoritesLoadmoreComponent} from "./favorites/favorites-load-more/load-more.component";
import {AuthServiceConfig, FacebookLoginProvider, SocialLoginModule} from "angular4-social-login";
import {environment} from "../../../environments/environment.prod";
import {ReservationTourComponent} from "./reservationtour/reservationtour.component";
import {ReservationTourDetailComponent} from "./reservationtour/detail/detail.component";
import {CancelCompletationComponent} from "./reservationtour/detail/cancel_completation/cancel_completation.component";
import {CancelConfirmationComponent} from "./reservationtour/detail/cancel_confirmation/cancel_confirmation.component";
import {MessageInputComponent} from "./reservationtour/detail/message_input/message_input.component";
import {MessageSendComponent} from "./reservationtour/detail/message_send/message_send.component";
import {ReviewRegisterComponent} from "./reservationtour/detail/review_register/review_register.component";
import {ReviewCompletationComponent} from "./reservationtour/detail/review_completation/review_completation.component";
/*import {TopMypageMenuModule} from "../../shared/top-mypage-menu/top-mypage-menu.module";*/

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
    SharedModule,
    myPageRouting,
    FormsModule,
    SocialLoginModule
    /*TopMypageMenuModule*/
  ],
  declarations: [
    MypageComponent,
    FavoritesComponent,
    MessageboxComponent,
    ProfileComponent,
    MailCompletationComponent,
    MailSendComponent,
    MailUpdateComponent,
    ResumComponent,
    RequestComponent,
    UpdateComponent,
    MypageMoneyComponent,
    FavoritesLoadmoreComponent,
    ReservationTourComponent,
    ReservationTourDetailComponent,
    CancelCompletationComponent,
    CancelConfirmationComponent,
    MessageInputComponent,
    MessageSendComponent,
    ReviewRegisterComponent,
    ReviewCompletationComponent
  ],
  providers:
      [
        {
          provide: AuthServiceConfig,
          useFactory: provideConfig
        }
      ]
})
export class MypageModule{}
