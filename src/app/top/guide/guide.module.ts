import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {guideRouting} from "./guide.routing";
import {GuideComponent} from "./guide.component";
import {GuideDetailComponent} from "./guide-detail/guide-detail.component";
import {SharedModule} from "../../shared/shared.module";
import {LoadmoreComponent} from "../layouts/load-more/load-more.component";

@NgModule({
  imports: [
    CommonModule,
    guideRouting,
    SharedModule
  ],
  declarations: [
    GuideComponent,
    GuideDetailComponent
  ]
})
export class GuideModule { }
