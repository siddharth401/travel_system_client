import {NgModule} from '@angular/core';
import {SmartadminLayoutModule} from "../../../admin/shared/layout/layout.module";
import {ListComponent} from "./list.component";
import {RequestListBreadcrumbComponent} from "./breadcrumb/breadcrumb.component";
import {ListRouting} from "./list.routing"
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../../shared/shared.module";
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';



@NgModule({
    imports: [
        ListRouting,
        SmartadminLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CommonModule,
        ReactiveFormsModule,
    ],
    declarations: [ListComponent, RequestListBreadcrumbComponent],
    providers: []
})

export class ListModule {
}