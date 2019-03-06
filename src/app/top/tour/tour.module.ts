import {NgModule} from '@angular/core';
import {TourRouting} from "./tour.routing";
import {SmartadminLayoutModule} from "../../admin/shared/layout/layout.module";
import {DetailComponent} from "./detail.component";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../shared/shared.module";
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
/*import { DateTimePickerModule } from 'ng-pick-datetime';*/
import { CeiboShare } from 'ng2-social-share';


@NgModule({
    imports: [
        TourRouting,
        SmartadminLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CommonModule,
        ReactiveFormsModule,
        CommonModule,
        /*DateTimePickerModule*/
    ],
    declarations: [DetailComponent,CeiboShare],
    providers: []
})

export class TourModule {
}