import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from "./list.component";

export const ListRouters: Routes =
    [
        {
            path: '',
            data:
            {
                pageTitle: 'Request lists'
            },
            children:
                [
                    { path: 'search', component: ListComponent },
                    { path: 'search/:param', component: ListComponent },
                    { path: 'search/:param/:param_1', component: ListComponent },
                    { path: 'search/:param/:param_1/:param_2', component: ListComponent },
                    { path: 'search/:param/:param_1/:param_2/:param_3', component: ListComponent },
                ]
        },

    ];

export const ListRouting = RouterModule.forChild(ListRouters);

