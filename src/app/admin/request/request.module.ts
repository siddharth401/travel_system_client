import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SmartadminModule} from "../shared/smartadmin.module";
import {RequestRouting} from "./request.routing";
import {SharedModule} from "../../shared/shared.module";
import {ListComponent} from "./list.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FormComponent} from "./form.component";
import {SuggestionComponent} from "./suggestion.component";

@NgModule({
    imports: [
        CommonModule,
        RequestRouting,
        SmartadminModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [ListComponent, FormComponent, SuggestionComponent]
})
export class RequestModule { }
