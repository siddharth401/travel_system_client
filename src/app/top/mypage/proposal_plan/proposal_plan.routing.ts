import { Routes, RouterModule } from '@angular/router';
// import {CreateComponent} from "./create.component";
// import {ConfirmationComponent} from "./confirmation.component";
// import {ApplyComponent} from "./apply.component";
import {ListComponent} from "./list.component";
import {DetailComponent} from "./detail.component";
import {EditComponent} from "./edit.component";
import {EditConfirmationComponent} from "./editconfirmation.component";
import {EditCompletionComponent} from "./editcompletion.component";
import {MessageInputComponent} from "./message-input.component";
import {MessageSendComponent} from "./message-send.component";

// import {EditApplyComponent} from "./editapply.component";
// import {ReviewComponent} from "./review.component";
// import { DetailComponent } from "./detail.component";
// import {ReservationComponent} from "./reservation.component";
// import {ConfirmationComponent} from "./confirmation.component";
// import {CompletionComponent} from "./completion.component";
// import {MessageInputComponent} from "./message-input.component";

export const ProposalPlanRouters: Routes =
    [
        {
            path: '',
            data:
            {
                pageTitle: 'Page'
            },
            children:
                [
                    { path: '', component: ListComponent },
                    // { path: 'create', component: CreateComponent },
                    { path: 'editconfirmation', component: EditConfirmationComponent },
                    { path: 'editcompletion', component: EditCompletionComponent },
                    // { path: 'apply', component: ApplyComponent },
                    { path: 'edit/:id', component: EditComponent },
                    { path: 'detail/:id/message_send', component: MessageSendComponent },
                    { path: 'detail/:id/message_input', component: MessageInputComponent },
                    { path: 'detail/:id', component: DetailComponent },

                    // { path: 'editconfirmation', component: EditConfirmationComponent },
                    // { path: 'editapply', component: EditApplyComponent },
                    // { path: 'review', component: ReviewComponent },
                    { path: '**', redirectTo: '' }

                    // { path: 'detail/:id', component: DetailComponent },
                    // { path: 'reservation', component: ReservationComponent },
                    // { path: 'reservation/confirmation', component: ConfirmationComponent },
                    // { path: 'reservation/completion', component: CompletionComponent },
                ]
        },

    ];

export const ProposalPlanRouting = RouterModule.forChild(ProposalPlanRouters);

