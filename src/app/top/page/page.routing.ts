import { Routes, RouterModule } from '@angular/router';
import {NotFoundComponent} from "./not-found.component";
import {PaymentErrorComponent} from "./payment/plan/error.component";
import {ProposalPaymentErrorComponent} from "./payment/proposal-plan/proposal-plan-error.component";
import {InvalidAuthComponent} from "./invalid-auth.component";

export const pageRoutes: Routes =
[
    {path: 'not-found',component: NotFoundComponent},
    {path: 'invalid-auth',component: InvalidAuthComponent},
    {path: 'plan/payment/error',component: PaymentErrorComponent},
    {path: 'plan/payment/error/:code',component: PaymentErrorComponent},
    {path: 'proposal/payment/error',component: ProposalPaymentErrorComponent},
    {path: 'proposal/payment/error/:code',component: ProposalPaymentErrorComponent}
];

export const PageRouting = RouterModule.forChild(pageRoutes);

