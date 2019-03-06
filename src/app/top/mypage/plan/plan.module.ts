import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../../shared/shared.module";
import {PlanRouting} from "./plan.routing";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CreateComponent} from "./create.component";
import {ConfirmationComponent} from "./confirmation.component";
import {ApplyComponent} from "./apply.component";
import {ListComponent} from "./list.component";
import {DetailComponent} from "./detail.component";
import {EditComponent} from "./edit.component";
import {EditConfirmationComponent} from "./editconfirmation.component";
import {EditApplyComponent} from "./editapply.component";
import {ReviewComponent} from "./review.component";
// import {SafePipe} from "../../tour/SafePipe";
import {DateSelectComponent} from "./dateselect.component";
import {DateRegisterComponent} from "./dateregister.component";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        PlanRouting,
        FormsModule,
    ],
    declarations: [
        ListComponent,CreateComponent,ConfirmationComponent,ApplyComponent, DetailComponent,
        EditComponent,EditConfirmationComponent,EditApplyComponent,ReviewComponent,
        DateSelectComponent,DateRegisterComponent
    ],
    exports: [
        // DetailComponent,MessageInputComponent
    ]
})
export class PlanModule{}
