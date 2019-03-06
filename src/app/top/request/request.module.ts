import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {requestRouting} from "./request.routing";
import {RequestComponent} from "./request.component";
import {ListModule} from "./list/list.module";
import {DetailComponent} from "./detail/detail.component";
import {SharedModule} from "../../shared/shared.module";
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import {SearchContentModule} from "./search-content/search-content.module"

@NgModule({
    imports: [
        CommonModule,
        requestRouting,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        SearchContentModule,
        ListModule
    ],
    declarations: [
        RequestComponent,
        DetailComponent
    ]
})
export class RequestModule { }
