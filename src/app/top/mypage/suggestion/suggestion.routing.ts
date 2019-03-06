import { Routes, RouterModule } from '@angular/router';
import { DetailComponent } from "./detail.component";
import {ReservationComponent} from "./reservation.component";
import {ConfirmationComponent} from "./confirmation.component";
import {CompletionComponent} from "./completion.component";
import {MessageInputComponent} from "./message-input.component";
import {MessageSendComponent} from "./message-send.component";

export const SuggestionRouters: Routes =
    [
        {
            path: '',
            data:
            {
                pageTitle: 'Page'
            },
            children:
                [
                    { path: 'detail/:id/message_input', component: MessageInputComponent },
                    { path: 'detail/:id/message_send', component: MessageSendComponent },
                    { path: 'detail/:id', component: DetailComponent },
                    { path: 'reservation', component: ReservationComponent },
                    { path: 'reservation/confirmation', component: ConfirmationComponent },
                    { path: 'reservation/completion', component: CompletionComponent },
                ]
        },

    ];

export const SuggestionRouting = RouterModule.forChild(SuggestionRouters);

