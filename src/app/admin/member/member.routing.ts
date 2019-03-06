import { Routes, RouterModule } from '@angular/router';
import {ModuleWithProviders} from "@angular/core";
import {FormComponent} from "./form.component";
import {ListComponent} from "./list.component";

export const MemberRoutes: Routes = [
    {
        path: '',
        data: {
            pageTitle: 'Member'
        },
        children: [
            { path: '', component: ListComponent },
            { path: 'form', component: FormComponent},
            { path: 'form/:id', component: FormComponent}
        ]
    }
];

export const MemberRouting: ModuleWithProviders = RouterModule.forChild(MemberRoutes);

