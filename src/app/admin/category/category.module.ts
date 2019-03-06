import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SmartadminModule} from "../shared/smartadmin.module";
import {CategoryRouting} from "./category.routing";
import {FormComponent} from "./form.component";
import {SharedModule} from "../../shared/shared.module";
import {ListComponent} from "./list.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    CategoryRouting,
    SmartadminModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ListComponent,FormComponent]
})
export class CategoryModule { }
