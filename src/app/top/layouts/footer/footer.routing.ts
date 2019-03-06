import { Routes, RouterModule } from '@angular/router';

export const footerRoutes: Routes = [
    {
        path: '',
        data: {
            pageTitle: 'Home'
        }
    }
];

export const footerRouting = RouterModule.forChild(footerRoutes);

