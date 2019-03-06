import { Routes, RouterModule } from '@angular/router';
import {ModuleWithProviders} from "@angular/core";
import {ListComponent} from "./list.component";
import {FormComponent} from "./form.component";
import {SuggestionComponent} from "./suggestion.component";

export const RequestRoutes: Routes = [
    {
        path: '',
        data: {
            pageTitle: 'Request'
        },
        children: [
            { path: '', component: ListComponent },
            { path: 'form', component: FormComponent},
            { path: 'form/:id', component: FormComponent},
            { path: 'suggestion/:id', component: SuggestionComponent}
        ]
    }
];

export const RequestRouting: ModuleWithProviders = RouterModule.forChild(RequestRoutes);

