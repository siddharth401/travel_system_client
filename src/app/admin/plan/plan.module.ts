import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanRouting } from "./plan.routing";
import { SmartadminModule } from "../shared/smartadmin.module";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";
import { ListComponent } from "./list.component";
import { FormComponent } from "./form.component";
// google map
import { AgmCoreModule } from '@agm/core';
import {Select2Component} from 'angular-select2-component';
// import {SafePipe} from './SafePipe';
import {CalendarModule} from "../calendar/calendar.module";


@NgModule({
    imports: [
        CommonModule,
        PlanRouting,
        SmartadminModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CalendarModule
        //google map
    ],
    exports: [],
    providers: [],
    declarations: [FormComponent,ListComponent,Select2Component]
})
export class PlanModule { }
