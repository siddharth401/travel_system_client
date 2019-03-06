import { Routes, RouterModule } from '@angular/router';

export const headerRoutes: Routes = [
    {
        path: '',
        data: {
            pageTitle: 'Home'
        }
    }
];

export const headerRouting = RouterModule.forChild(headerRoutes);

