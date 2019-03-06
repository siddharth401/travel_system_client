import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopRoutingModule } from "./top.routing";
import { DefaultLayoutModule } from "./layouts/default-layout.module";
import { FormsModule }   from '@angular/forms';
import {MemberLayoutModule} from "./member/member-layout/member-layout.module";
import {TopForgotPasswordComponent} from "./page/forgot-password/forgot-password.component";
import {TermsComponent} from "./page/terms/terms.component";
import {AboutCompanyComponent} from "./page/about-company/about-company.component";
import {CancelPolicyComponent} from "./page/cancel-policy/cancel-policy.component";
import {HowToUseComponent} from "./page/how-to-use/how-to-use.component";
import {QuestionAnswersComponent} from "./page/question-answers/question-answers.component";
import {TravelBussinessComponent} from "./page/travel-bussiness/travel-bussiness.component";
import {MemberActiveComponent} from "./page/member-active/active.component";
import {PrivacyPolicyComponent} from "./page/privacy-policy/privacy-policy.component";
import {AboutComponent} from "./page/about/about.component";
import {SafetyComponent} from "./page/safety/safety.component";
import {PolicyComponent} from "./page/policy/policy.component";
import {ArticleComponent} from "./page/article/article.component";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  imports: [
      CommonModule,
      TopRoutingModule,
      FormsModule,
      DefaultLayoutModule,
      MemberLayoutModule,
      SharedModule
  ],
  declarations: [
      TermsComponent,
      AboutCompanyComponent,
      CancelPolicyComponent,
      PrivacyPolicyComponent,
      HowToUseComponent,
      QuestionAnswersComponent,
      TravelBussinessComponent,
      TopForgotPasswordComponent,
      MemberActiveComponent,
      AboutComponent,
      SafetyComponent,
      PolicyComponent,
      ArticleComponent
  ]
})
export class TopModule { }
