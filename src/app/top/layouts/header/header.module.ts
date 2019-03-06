import {NgModule} from "@angular/core";
import {HeaderComponent} from "./header.component";
import { CommonModule } from '@angular/common';
import { headerRouting } from './header.routing';
import { LanguageDisplayComponent } from './language-display/language-display.component';
import {SharedModule} from "../../../shared/shared.module";
import {SlideMenuComponent} from "../slide-menu/slide-menu.component";
import {SearchSpComponent} from "../search-sp/search-sp.component";


@NgModule({
    imports: [
        headerRouting,
        CommonModule,
        SharedModule
    ],
    declarations: [
        HeaderComponent,
        LanguageDisplayComponent,
        SlideMenuComponent,
        SearchSpComponent
    ],
    exports: [
        HeaderComponent,
        LanguageDisplayComponent,
        SlideMenuComponent,
        SearchSpComponent
    ]
})
export class HeaderModule{}