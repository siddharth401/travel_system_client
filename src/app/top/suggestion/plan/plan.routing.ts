import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from "./add.component";
import {ConfirmationComponent} from "./confirmation.component";
import {CompletionComponent} from "./completion.component";
// import { DetailComponent } from "./detail.component";

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
                    { path: 'add/:request_id', component: AddComponent },
                    { path: 'confirmation', component: ConfirmationComponent },
                    { path: 'completion', component: CompletionComponent },
                ]
        },

    ];

export const PlanRouting = RouterModule.forChild(PlanRouters);

