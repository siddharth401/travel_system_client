import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommissionRouting } from "./commission.routing";
import { SmartadminModule } from "../shared/smartadmin.module";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";
import { FormComponent } from "./form.component";

@NgModule({
    imports: [
        CommonModule,
        CommissionRouting,
        SmartadminModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    exports: [],
    providers: [],
    declarations: [FormComponent]
})
export class CommissionModule { }
