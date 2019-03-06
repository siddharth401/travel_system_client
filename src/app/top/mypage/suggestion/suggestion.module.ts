import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../../shared/shared.module";
import {DetailComponent} from "./detail.component";
import {ReservationComponent} from "./reservation.component";
import {SuggestionRouting} from "./suggestion.routing";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ConfirmationComponent} from "./confirmation.component";
import {CompletionComponent} from "./completion.component";
import {MessageInputComponent} from "./message-input.component";
import {MessageSendComponent} from "./message-send.component";


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        SuggestionRouting,
        FormsModule,
    ],
    declarations: [
        DetailComponent,ReservationComponent,ConfirmationComponent,CompletionComponent,MessageInputComponent,MessageSendComponent
    ],
    exports: [
        DetailComponent,MessageInputComponent
    ]
})
export class SuggestionModule{}
