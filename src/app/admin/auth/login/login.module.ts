import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { routing} from "../auth.routing";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        routing,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations:
        [
            LoginComponent
        ],
    providers : []
})
export class LoginModule { }
