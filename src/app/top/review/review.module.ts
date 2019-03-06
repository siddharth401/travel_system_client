import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {reviewRouting} from "./review.routing";
import {ReviewComponent} from "./review.component";
import {SharedModule} from "../../shared/shared.module";
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        reviewRouting,
        SharedModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        ReviewComponent
    ]
})
export class ReviewModule { }
