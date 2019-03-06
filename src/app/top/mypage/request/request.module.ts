import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {requestRouting} from "./request.routing";
import {MypageRequestComponent} from "./request.component";
import {MypageRequestListComponent} from "./list/list.component";
import {MypageRequestDetailComponent} from "./detail/detail.component";
import {MypageRequestAddComponent} from "./add/add.component";
import {MypageRequestCompletionComponent} from "./completion/completion.component";
import {MypageRequestConfirmationComponent} from "./confirmation/confirmation.component";
import {SharedModule} from "../../../shared/shared.module";
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        requestRouting,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        MypageRequestComponent,
        MypageRequestListComponent,
        MypageRequestDetailComponent,
        MypageRequestAddComponent,
        MypageRequestCompletionComponent,
        MypageRequestConfirmationComponent
    ]
})
export class MypageRequestModule { }
