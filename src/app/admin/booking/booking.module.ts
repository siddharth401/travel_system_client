import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SmartadminModule} from "../shared/smartadmin.module";
import {BookingRouting} from "./booking.routing";
import {SharedModule} from "../../shared/shared.module";
import {ListComponent} from "./list.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FormComponent} from "./form.component";

@NgModule({
    imports: [
        CommonModule,
        BookingRouting,
        SmartadminModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [ListComponent, FormComponent]
})
export class BookingModule { }
