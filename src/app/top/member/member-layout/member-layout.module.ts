import {NgModule} from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import {MemberLayoutComponent} from "./member-layout.component";

@NgModule({
    imports: [
        RouterModule
    ],
    declarations: [
        MemberLayoutComponent
    ],
    exports: [
        MemberLayoutComponent,
        RouterModule
    ]
})
export class MemberLayoutModule{

}
