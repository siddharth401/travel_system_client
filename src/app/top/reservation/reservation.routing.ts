import { Routes, RouterModule } from '@angular/router';
import {ReservationComponent} from "./reservation.component";
import {RegisterComponent} from "./register/register.component";
import {ConfirmationComponent} from "./confirmation/confirmation.component";
import {CompletationComponent} from "./completation/completation.component";

export const reservationRoutes: Routes = [
    {
        path: '',
        data: {
            pageTitle: 'Reservation'
        },
        component: ReservationComponent ,
        children: [
            { path: ':id', component: RegisterComponent },
            { path: ':id/confirmation', component: ConfirmationComponent },
            { path: ':id/completion', component: CompletationComponent },

        ]
    }
];

export const reservationRouting = RouterModule.forChild(reservationRoutes);

