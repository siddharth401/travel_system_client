import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {applyRouting} from "./apply.routing";
import {MypageApplyComponent} from "./apply.component";
import {MypageApplyListComponent} from "./list/list.component";
import {MypageApplyDetailComponent} from "./detail/detail.component";
import {MypageApplyMessageInputComponent} from "./messageinput/messageinput.component";
import {MypageApplyMessageSendComponent} from "./messagesend/messagesend.component";
import {SharedModule} from "../../../shared/shared.module";
import {FormsModule, ReactiveFormsModule}   from '@angular/forms';
import {UserHyoukaComponent} from "./user_hyouka/user_hyouka.component";
import {CancelCompletationComponent} from "./cancel_completation/cancel_completation.component";
import {UserHyoukaConfirmComponent} from "./user_hyouka_confirm/user_hyouka_confirm.component";

@NgModule({
    imports: [
        CommonModule,
        applyRouting,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        MypageApplyComponent,
        MypageApplyListComponent,
        MypageApplyDetailComponent,
        MypageApplyMessageInputComponent,
        MypageApplyMessageSendComponent,
        UserHyoukaComponent,
        CancelCompletationComponent,
        UserHyoukaConfirmComponent
    ]
})
export class MypageApplyModule { }
