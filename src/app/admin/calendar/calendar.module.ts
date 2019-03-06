import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartadminModule } from "../shared/smartadmin.module";
import { SmartadminDatatableModule } from "../shared/ui/datatable/smartadmin-datatable.module";
import {SharedModule} from "../../shared/shared.module";

import {CalendarRouting} from "./calendar.routing";
import {SettingComponent} from "./setting.component";
// import {PlanCalenderComponent} from "./plan_calender.component";

@NgModule({
  imports: [
    CommonModule,
    SmartadminModule,
    CalendarRouting,
    SharedModule
  ],
  providers: [],
  declarations: [ SettingComponent]
})
export class CalendarModule { }
