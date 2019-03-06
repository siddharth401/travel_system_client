import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRouting } from "./user.routing";
import { SmartadminModule } from "../shared/smartadmin.module";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";
import { ListComponent } from "./list.component";
import { FormComponent } from "./form.component";
import { ViewComponent } from "./view.component";

@NgModule({
  imports: [
    CommonModule,
    UserRouting,
    SmartadminModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [],
  providers: [],
  declarations: [ListComponent, FormComponent, ViewComponent]
})
export class UserModule { }
