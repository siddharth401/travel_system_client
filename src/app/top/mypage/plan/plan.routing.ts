import { Routes, RouterModule } from '@angular/router';
import {CreateComponent} from "./create.component";
import {ConfirmationComponent} from "./confirmation.component";
import {ApplyComponent} from "./apply.component";
import {ListComponent} from "./list.component";
import {DetailComponent} from "./detail.component";
import {EditComponent} from "./edit.component";
import {EditConfirmationComponent} from "./editconfirmation.component";
import {EditApplyComponent} from "./editapply.component";
import {ReviewComponent} from "./review.component";
import {DateSelectComponent} from "./dateselect.component";
import {DateRegisterComponent} from "./dateregister.component";
// import { DetailComponent } from "./detail.component";
// import {ReservationComponent} from "./reservation.component";
// import {ConfirmationComponent} from "./confirmation.component";
// import {CompletionComponent} from "./completion.component";
// import {MessageInputComponent} from "./message-input.component";

export const PlanRouters: Routes =
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
                    { path: 'create', component: CreateComponent },
                    { path: 'confirmation', component: ConfirmationComponent },
                    { path: 'apply', component: ApplyComponent },
                    { path: 'detail/:id', component: DetailComponent },
                    { path: 'edit/:id', component: EditComponent },
                    { path: 'editconfirmation', component: EditConfirmationComponent },
                    { path: 'editapply', component: EditApplyComponent },
                    { path: 'review', component: ReviewComponent },
                    { path: 'dateselect/:id', component: DateSelectComponent },
                    { path: 'dateregister/:id/:month', component: DateRegisterComponent },
                    { path: 'review/:id', component: ReviewComponent },
                    { path: '**', redirectTo: '' }

                    // { path: 'detail/:id', component: DetailComponent },
                    // { path: 'reservation', component: ReservationComponent },
                    // { path: 'reservation/confirmation', component: ConfirmationComponent },
                    // { path: 'reservation/completion', component: CompletionComponent },
                ]
        },

    ];

export const PlanRouting = RouterModule.forChild(PlanRouters);

