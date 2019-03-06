import { Routes, RouterModule } from '@angular/router';
import {PasswordComponent} from "./password.component";

export const PasswordRoutes: Routes = [
    {
        path: '',
        component: PasswordComponent,
        data: {
            pageTitle: 'Change Password'
        }
    }
];

export const PasswordRouting = RouterModule.forChild(PasswordRoutes);

