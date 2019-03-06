import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../../shared/shared.module";
import {AddComponent} from "./add.component";
import {PlanRouting} from "./plan.routing";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ConfirmationComponent} from "./confirmation.component";
import {CompletionComponent} from "./completion.component";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        PlanRouting,
        FormsModule,
    ],
    declarations: [
        AddComponent,ConfirmationComponent,CompletionComponent
    ],
    exports: [
        AddComponent,
    ]
})
export class PlanModule{}
