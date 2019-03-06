import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartadminModule } from "../shared/smartadmin.module";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";
import { ListComponent } from "./list.component";
import { FormComponent } from "./form.component";
import {PrefectureRouting} from "./prefecture.routing";

@NgModule({
    imports: [
        CommonModule,
        PrefectureRouting,
        SmartadminModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    exports: [],
    providers: [],
    declarations: [FormComponent,ListComponent]
})
export class PrefectureModule { }
