import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeRouting} from './home.routing';
import {SmartadminModule} from "../shared/smartadmin.module";
import {HomeComponent} from "./home.component";
import { SharedModule } from "../../shared/shared.module";


@NgModule({
  imports: [
    CommonModule,
    HomeRouting,
    SmartadminModule,
    SharedModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
