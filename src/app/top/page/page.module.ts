import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageRouting } from './page.routing';
import {NotFoundComponent} from "./not-found.component";
import {PaymentErrorComponent} from "./payment/plan/error.component";
import {ProposalPaymentErrorComponent} from "./payment/proposal-plan/proposal-plan-error.component";
import {InvalidAuthComponent} from "./invalid-auth.component";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    PageRouting,
    SharedModule
  ],
  declarations:
  [
    NotFoundComponent,
    InvalidAuthComponent,
    PaymentErrorComponent,
    ProposalPaymentErrorComponent
  ]
})
export class PageModule { }
