import { Routes, RouterModule } from '@angular/router';
import {ProfileComponent} from "./profile.component";

export const ProfileRoutes: Routes = [
    {
        path: '',
        component: ProfileComponent,
        data: {
            pageTitle: 'Profile'
        }
    }
];

export const ProfileRouting = RouterModule.forChild(ProfileRoutes);

