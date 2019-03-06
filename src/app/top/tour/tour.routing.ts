import { Routes, RouterModule } from '@angular/router';
import { DetailComponent } from "./detail.component";

export const TourRouters: Routes =
    [
        {
            path: '',
            data:
            {
                pageTitle: 'Page'
            },
            children:
                [
                    { path: 'detail/:plan_id', component: DetailComponent },
                ]
        },

    ];

export const TourRouting = RouterModule.forChild(TourRouters);

