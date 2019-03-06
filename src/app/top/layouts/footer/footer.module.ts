import {NgModule} from "@angular/core";
import { CommonModule } from '@angular/common';
import {FooterComponent} from "./footer.component";
import { footerRouting } from './footer.routing';
import {SharedModule} from "../../../shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        footerRouting,
        SharedModule
    ],
    declarations: [
        FooterComponent
    ],
    exports: [
        FooterComponent
    ]
})
export class FooterModule{}