import {NgModule} from '@angular/core';
import {PageRouting} from "./page.routing";
import {SmartadminLayoutModule} from "../admin/shared/layout/layout.module";
import {CommonModule} from "@angular/common";
import { ForgotPasswordComponent } from "./forgot_password.component";

@NgModule({
    imports: [
        CommonModule,
        PageRouting,
        SmartadminLayoutModule
    ],
    declarations: [ForgotPasswordComponent],
    providers: []
})

export class PageModule {}