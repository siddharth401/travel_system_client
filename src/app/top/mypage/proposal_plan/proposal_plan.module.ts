import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../../shared/shared.module";
import {ProposalPlanRouting} from "./proposal_plan.routing";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ListComponent} from "./list.component";
import {DetailComponent} from "./detail.component";
import {EditComponent} from "./edit.component";
import {EditConfirmationComponent} from "./editconfirmation.component";
import {EditCompletionComponent} from "./editcompletion.component";
import {MessageInputComponent} from "./message-input.component";
import {MessageSendComponent} from "./message-send.component";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ProposalPlanRouting,
        FormsModule,
    ],
    declarations: [
        ListComponent,DetailComponent,EditComponent,EditConfirmationComponent,EditCompletionComponent,MessageInputComponent,MessageSendComponent
    ],
    exports: [
    ]
})
export class ProposalPlanModule{}
