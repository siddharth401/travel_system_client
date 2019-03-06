import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListPipe } from "./list.pipe";
import { TranslationPipe } from "./translation/translation.pipe";
import { TopTranslationPipe } from "./top-translation/top-translation.pipe";
import { UploadComponent } from "./upload/upload.component";
import { PaginatorComponent } from './paginator/paginator.component';
import { DatexPipe } from './datex.pipe';
import { FileBrowserComponent } from "./file-browser/file-browser.component";
import {InputBrowserComponent} from "./input-browser/input-browser.component";
import {Nl2brPipe} from "./nl2br.pipe";
import {SafeHtmlPipe} from "./safehtml.pipe";
import {SafePipe} from "./SafePipe";
import {AddFixedIdPipe} from "./addFixedId";
import {TopStarComponent} from "./top-star/top-star.component";
import {LimitPipe} from "./limit.pipe";
import {NumberFormatPipe} from "./numberformat.pipe";
import {SeeFulllComponent} from "../top/layouts/see-full/see-full.component";
import {LoadmoreComponent} from "../top/layouts/load-more/load-more.component";
import {TopMypageMenuComponent} from "./top-mypage-menu/top-mypage-menu.component";
import {TopMypageHeadComponent} from "./top-mypage-head/top-mypage-head.component";
import {LanguageSelectorComponent} from "../admin/shared/layout/header/language-selector/language-selector.component";
import {ReplacePipe} from "./ttrans_replace.pipe";
import {FormatHourPipe} from "./formatHour.pipe";

@NgModule({
  imports: [
    CommonModule
  ],
  exports : [         ListPipe,
                      TranslationPipe,
                      TopTranslationPipe,
                      UploadComponent,
                      PaginatorComponent,
                      DatexPipe,
                      FileBrowserComponent,
                      InputBrowserComponent,
                      Nl2brPipe,
                      SafeHtmlPipe,
                      AddFixedIdPipe,
                      TopStarComponent,
                      LimitPipe,
                      NumberFormatPipe,
                      SeeFulllComponent,
                      LoadmoreComponent,
                      TopMypageMenuComponent,
                      TopMypageHeadComponent,
                      SafePipe,
                      LanguageSelectorComponent,
                      ReplacePipe,
                      FormatHourPipe

            ],
  declarations: [     ListPipe,
                      TranslationPipe,
                      TopTranslationPipe,
                      UploadComponent,
                      PaginatorComponent,
                      DatexPipe,
                      FileBrowserComponent,
                      InputBrowserComponent,
                      Nl2brPipe,
                      SafeHtmlPipe,
                      AddFixedIdPipe,
                      TopStarComponent,
                      LimitPipe,
                      NumberFormatPipe,
                      SeeFulllComponent,
                      LoadmoreComponent,
                      TopMypageMenuComponent,
                      TopMypageHeadComponent,
                      SafePipe,
                      LanguageSelectorComponent,
                      ReplacePipe,
                      FormatHourPipe
                ]
})
export class SharedModule { }
