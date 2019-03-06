import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from "./list.component";

export const SearchRouters: Routes =
    [
        {
            path: '',
            data:
            {
                pageTitle: 'Page'
            },
            children:
                [
                    { path: '', component: ListComponent },
                    { path: ':param', component: ListComponent },
                    { path: ':param/:param_1', component: ListComponent },
                    { path: ':param/:param_1/:param_2', component: ListComponent },
                    { path: ':param/:param_1/:param_2/:param_3', component: ListComponent },
                    { path: ':param/:param_1/:param_2/:param_3/:param_4', component: ListComponent }

                ]
        },

    ];

export const SearchRouting = RouterModule.forChild(SearchRouters);

