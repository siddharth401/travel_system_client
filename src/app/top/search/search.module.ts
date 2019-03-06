import {NgModule} from '@angular/core';
import {SmartadminLayoutModule} from "../../admin/shared/layout/layout.module";
import {ListComponent} from "./list.component";
import {SearchBreadcrumbComponent} from "./breadcrumb/breadcrumb.component";
import {SearchRouting} from "./search.routing"
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../shared/shared.module";
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';



@NgModule({
    imports: [
        SearchRouting,
        SmartadminLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CommonModule,
        ReactiveFormsModule,
    ],
    declarations: [ListComponent, SearchBreadcrumbComponent],
    providers: []
})

export class SearchModule {
}