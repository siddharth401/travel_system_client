import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {reservationRouting} from "./reservation.routing";
import {ReservationComponent} from "./reservation.component";
import {RegisterComponent} from "./register/register.component";
import {ConfirmationComponent} from "./confirmation/confirmation.component";
import {CompletationComponent} from "./completation/completation.component";
import {SharedModule} from "../../shared/shared.module";
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        reservationRouting,
        SharedModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        ReservationComponent,
        RegisterComponent,
        ConfirmationComponent,
        CompletationComponent
    ]
})
export class ReservationModule { }
