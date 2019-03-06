import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {LoadingComponent} from "./loading.component";

@NgModule({
    declarations: [
        LoadingComponent
    ],
    exports: [LoadingComponent],
    imports: [
        BrowserModule
    ]
})
export class LoadingModule { }
