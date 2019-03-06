import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home.component";
import {ModuleWithProviders} from "@angular/core";

export const HomeRoutes: Routes = [
    {
        path: '',
        component: HomeComponent,
        data: {
            pageTitle: 'Home'
        }
    }
];

export const HomeRouting: ModuleWithProviders = RouterModule.forChild(HomeRoutes);

