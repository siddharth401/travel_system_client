import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { homeRouting } from './home.routing';
import {HomeComponent} from "./home.component";
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import {ContentVisualComponent} from "./content-visual/content-visual.component";
import {ContentAboutComponent} from "./content-about/content-about.component";
import {ContentPlanListComponent} from "./content-plan-list/content-plan-list.component";
import {ContentRequestListComponent} from "./content-request-list/content-request-list.component";
import {ContentReviewComponent} from "./content-review/content-review.component";
import {FixedAreaComponent} from "./fixed-area/fixed-area.component";

import {SharedModule} from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    homeRouting,
    FormsModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [
    HomeComponent,
    ContentVisualComponent,
    ContentAboutComponent,
    ContentPlanListComponent,
    ContentRequestListComponent,
    ContentReviewComponent,
    FixedAreaComponent
  ]
})
export class HomeModule { }
