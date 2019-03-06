import { Routes, RouterModule } from '@angular/router';
import {ModuleWithProviders} from "@angular/core";
import {ListComponent} from "./list.component";
import {FormComponent} from "./form.component";

export const BookingRoutes: Routes = [
    {
        path: '',
        data: {
            pageTitle: 'Booking'
        },
        children: [
            { path: '', component: ListComponent },
            { path: 'form', component: FormComponent},
            { path: 'form/:id', component: FormComponent}
        ]
    }
];

export const BookingRouting: ModuleWithProviders = RouterModule.forChild(BookingRoutes);

