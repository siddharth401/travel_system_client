import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../../shared/shared.module";
import {SearchContentComponent} from "./search-content.component";

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [
        SearchContentComponent,
    ],
    exports: [
        SearchContentComponent,
    ]
})
export class SearchContentModule{}
