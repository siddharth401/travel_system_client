import { Routes, RouterModule } from '@angular/router';
import {MypageComponent} from "./mypage.component";
import {FavoritesComponent} from "./favorites/favorites.component";
import {MessageboxComponent} from "./messagebox/messagebox.component";
import {ProfileComponent} from "./profile/profile.component";
import {MailCompletationComponent} from "./profile/mail_completation/mail_completation.component";
import {MailSendComponent} from "./profile/mail_send/mail_send.component";
import {MailUpdateComponent} from "./profile/mail_update/mail_update.component";
import {ResumComponent} from "./profile/resum/resum.component";
import {RequestComponent} from "./profile/request/request.component";
import {UpdateComponent} from "./profile/update/update.component";
import {ReservationTourComponent} from "./reservationtour/reservationtour.component";
import {ReservationTourDetailComponent} from "./reservationtour/detail/detail.component";
import {CancelCompletationComponent} from "./reservationtour/detail/cancel_completation/cancel_completation.component";
import {CancelConfirmationComponent} from "./reservationtour/detail/cancel_confirmation/cancel_confirmation.component";
import {MessageInputComponent} from "./reservationtour/detail/message_input/message_input.component";
import {MessageSendComponent} from "./reservationtour/detail/message_send/message_send.component";
import {ReviewCompletationComponent} from "./reservationtour/detail/review_completation/review_completation.component";
import {ReviewRegisterComponent} from "./reservationtour/detail/review_register/review_register.component";
import {MypageMoneyComponent} from "./money/money.component";

export const myPageRoutes: Routes = [
    {
        path: '',
        data: {
            pageTitle: 'Mypage'
        },
        children: [
            { path: '', component: MypageComponent},
            { path: 'reservationtour', component: ReservationTourComponent },
            { path: 'reservationtour/detail/:id', component: ReservationTourDetailComponent },
            { path: 'reservationtour/detail/:id/cancel_completation', component: CancelCompletationComponent },
            { path: 'reservationtour/detail/:id/cancel_confirmation', component: CancelConfirmationComponent },
            { path: 'reservationtour/detail/:id/message_input', component: MessageInputComponent },
            { path: 'reservationtour/detail/:id/message_send', component: MessageSendComponent },
            { path: 'reservationtour/detail/:id/review_register', component: ReviewRegisterComponent },
            { path: 'reservationtour/detail/:id/review_completation', component: ReviewCompletationComponent },
            { path: 'favorites', component: FavoritesComponent},
            { path: 'messagebox', component: MessageboxComponent},
            { path: 'profile', component: ProfileComponent},
            { path: 'profile/mail_completation/:extra_token/:email', component: MailCompletationComponent},
            { path: 'profile/mail_send', component: MailSendComponent},
            { path: 'profile/mail_update', component: MailUpdateComponent},
            { path: 'profile/resume', component: ResumComponent},
            { path: 'profile/request', component: RequestComponent},
            { path: 'profile/update', component: UpdateComponent},
            { path:  'request', loadChildren: 'app/top/mypage/request/request.module#MypageRequestModule'},
            { path:  'apply', loadChildren: 'app/top/mypage/apply/apply.module#MypageApplyModule'},
            { path:  'money', component: MypageMoneyComponent}
    ]
    }
];

export const myPageRouting = RouterModule.forChild(myPageRoutes);

