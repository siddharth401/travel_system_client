import { Routes, RouterModule } from '@angular/router';
import {ReviewComponent} from "./review.component";

export const reviewRoutes: Routes = [
    {
        path: '',
        data: {
            pageTitle: 'Review'
        },
        component: ReviewComponent
    }
];

export const reviewRouting = RouterModule.forChild(reviewRoutes);

