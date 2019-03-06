import { Routes, RouterModule } from '@angular/router';
import {GuideComponent} from "./guide.component";
import {GuideDetailComponent} from "./guide-detail/guide-detail.component";

export const guideRoutes: Routes = [
    {
        path: '',
        data: {
            pageTitle: 'Host'
        },
        children: [
        { path: '', component: GuideComponent },
        { path: 'detail/:id', component: GuideDetailComponent }
    ]
    }
];

export const guideRouting = RouterModule.forChild(guideRoutes);

