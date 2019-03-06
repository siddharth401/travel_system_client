import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRouting } from './profile.routing';
import { SmartadminModule } from "../../shared/smartadmin.module";
import { ProfileComponent } from "./profile.component";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    ProfileRouting,
    SmartadminModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [ProfileComponent]
})
export class ProfileModule { }
