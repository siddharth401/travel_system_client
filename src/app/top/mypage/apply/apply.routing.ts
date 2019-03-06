import { Routes, RouterModule } from '@angular/router';
import {MypageApplyComponent} from "./apply.component";
import {MypageApplyListComponent} from "./list/list.component";
import {MypageApplyDetailComponent} from "./detail/detail.component";
import {MypageApplyMessageInputComponent} from "./messageinput/messageinput.component";
import {MypageApplyMessageSendComponent} from "./messagesend/messagesend.component";
import {UserHyoukaComponent} from "./user_hyouka/user_hyouka.component";
import {CancelCompletationComponent} from "./cancel_completation/cancel_completation.component";
import {UserHyoukaConfirmComponent} from "./user_hyouka_confirm/user_hyouka_confirm.component";

export const applyRoutes: Routes = [
    {
        path: '',
        data: {
            pageTitle: 'Mypage Apply'
        },
        component: MypageApplyComponent ,
        children: [
            { path: '', component: MypageApplyListComponent },
            { path: 'detail/:id', component: MypageApplyDetailComponent },
            { path: 'detail/:id/messageinput', component: MypageApplyMessageInputComponent },
            { path: 'detail/:id/messagesend', component: MypageApplyMessageSendComponent },
            { path: 'detail/:id/user_hyouka', component: UserHyoukaComponent },
            { path: 'detail/:id/user_hyouka_confirm', component: UserHyoukaConfirmComponent },
            { path: 'detail/:id/cancel_completation', component: CancelCompletationComponent },

        ]
    }
];

export const applyRouting = RouterModule.forChild(applyRoutes);

