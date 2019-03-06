import { Routes, RouterModule } from '@angular/router';
import {RequestComponent} from "./request.component";
import {DetailComponent} from "./detail/detail.component";

export const requestRoutes: Routes = [
    {
        path: '',
        data: {
            pageTitle: 'Request'
        },
        component: RequestComponent ,
        children: [
            { path: '', loadChildren: './list/list.module#ListModule' },
            { path: 'detail/:id', component: DetailComponent }
        ]
    }
];

export const requestRouting = RouterModule.forChild(requestRoutes);

