import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordRouting } from './password.routing';
import { SmartadminModule } from "../../shared/smartadmin.module";
import { PasswordComponent } from "./password.component";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    PasswordRouting,
    SmartadminModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [PasswordComponent]
})
export class PasswordModule { }
