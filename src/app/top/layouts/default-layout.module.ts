import {NgModule} from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import {DefaultLayoutComponent} from "./default-layout.component";
import {HeaderModule} from "./header/header.module";
import {FooterModule} from "./footer/footer.module";

@NgModule({
    imports: [
        HeaderModule,
        FooterModule,
        RouterModule
    ],
    declarations: [
        DefaultLayoutComponent
    ],
    exports: [
        DefaultLayoutComponent,
        RouterModule
    ]
})
export class DefaultLayoutModule{

}
