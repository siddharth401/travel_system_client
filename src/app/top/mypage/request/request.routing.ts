import { Routes, RouterModule } from '@angular/router';
import {MypageRequestComponent} from "./request.component";
import {MypageRequestListComponent} from "./list/list.component";
import {MypageRequestDetailComponent} from "./detail/detail.component";
import {MypageRequestAddComponent} from "./add/add.component";
import {MypageRequestCompletionComponent} from "./completion/completion.component";
import {MypageRequestConfirmationComponent} from "./confirmation/confirmation.component";

export const requestRoutes: Routes = [
    {
        path: '',
        data: {
            pageTitle: 'Mypage Request'
        },
        component: MypageRequestComponent ,
        children: [
            { path: '', component: MypageRequestListComponent },
            { path: 'detail/:id', component: MypageRequestDetailComponent },
            { path: 'add', component: MypageRequestAddComponent },
            { path: 'completion', component: MypageRequestCompletionComponent },
            { path: 'confirmation', component: MypageRequestConfirmationComponent },

        ]
    }
];

export const requestRouting = RouterModule.forChild(requestRoutes);

