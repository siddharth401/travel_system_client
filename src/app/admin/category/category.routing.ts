import { Routes, RouterModule } from '@angular/router';
import {ModuleWithProviders} from "@angular/core";
import {FormComponent} from "./form.component";
import {ListComponent} from "./list.component";

export const CategoryRoutes: Routes = [
    {
        path: '',
        data: {
            pageTitle: 'Category'
        },
        children: [
            { path: '', component: ListComponent },
            { path: 'form', component: FormComponent},
            { path: 'form/:id', component: FormComponent}
        ]
    }
];

export const CategoryRouting: ModuleWithProviders = RouterModule.forChild(CategoryRoutes);

