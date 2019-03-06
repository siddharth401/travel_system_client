import {NgModule}             from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DefaultLayoutComponent} from "./layouts/default-layout.component";
import {MemberLayoutComponent} from "./member/member-layout/member-layout.component";
import {TermsComponent} from "./page/terms/terms.component";
import {AboutCompanyComponent} from "./page/about-company/about-company.component";
import {CancelPolicyComponent} from "./page/cancel-policy/cancel-policy.component";
import {PrivacyPolicyComponent} from "./page/privacy-policy/privacy-policy.component";
import {HowToUseComponent} from "./page/how-to-use/how-to-use.component";
import {QuestionAnswersComponent} from "./page/question-answers/question-answers.component";
import {TravelBussinessComponent} from "./page/travel-bussiness/travel-bussiness.component";
import {TopForgotPasswordComponent} from "./page/forgot-password/forgot-password.component";
import {MemberActiveComponent} from "./page/member-active/active.component";
import {Privacy} from "tslint/lib/rules/completedDocsRule";
import {AboutComponent} from "./page/about/about.component";
import {SafetyComponent} from "./page/safety/safety.component";
import {PolicyComponent} from "./page/policy/policy.component";
import {ArticleComponent} from "./page/article/article.component";
const topRoutes:Routes =
    [
        {
            path: '',
            component: DefaultLayoutComponent,
            children: [
                {path: '', loadChildren: 'app/top/home/home.module#HomeModule'},
                {path: '',
                    children: [
                        {path: 'tour', loadChildren: 'app/top/tour/tour.module#TourModule'},
                        {path: 'search', loadChildren: 'app/top/search/search.module#SearchModule'},
                        {path: 'guide', loadChildren: 'app/top/guide/guide.module#GuideModule'},
                        {path: 'reservation', loadChildren: 'app/top/reservation/reservation.module#ReservationModule'},
                        {path: 'review', loadChildren: 'app/top/review/review.module#ReviewModule'},
                        {path: 'request', loadChildren: 'app/top/request/request.module#RequestModule'},
                        {path: 'suggestion/plan', loadChildren: 'app/top/suggestion/plan/plan.module#PlanModule'},
                        {path: 'legal', component: TermsComponent},
                        {path: 'article', component: ArticleComponent},
                        {path: 'company', component: AboutCompanyComponent},
                        {path: 'cancelpolicy', component: CancelPolicyComponent},
                        {path: 'privacypolicy', component: PrivacyPolicyComponent},
                        {path: 'usage', component: HowToUseComponent},
                        {path: 'about', component: AboutComponent},
                        {path: 'safety', component: SafetyComponent},
                        {path: 'question', component: QuestionAnswersComponent},
                        {path: 'travel_bussiness', component: TravelBussinessComponent},
                        {path: 'policy', component: PolicyComponent},
                        {path: 'mypage', loadChildren: 'app/top/mypage/mypage.module#MypageModule'},
                        {path: 'mypage/suggestion', loadChildren: 'app/top/mypage/suggestion/suggestion.module#SuggestionModule'},
                        {path: 'mypage/plan', loadChildren: 'app/top/mypage/plan/plan.module#PlanModule'},
                        {path: 'mypage/proposal_plan', loadChildren: 'app/top/mypage/proposal_plan/proposal_plan.module#ProposalPlanModule'},
                        {path: 'page', loadChildren: 'app/top/page/page.module#PageModule'}
                    ]
                },
                {path: ':language', loadChildren: 'app/top/home/home.module#HomeModule'},
                {path: ':language',
                    children: [
                        {path: 'tour', loadChildren: 'app/top/tour/tour.module#TourModule'},
                        {path: 'search', loadChildren: 'app/top/search/search.module#SearchModule'},
                        {path: 'guide', loadChildren: 'app/top/guide/guide.module#GuideModule'},
                        {path: 'reservation', loadChildren: 'app/top/reservation/reservation.module#ReservationModule'},
                        {path: 'review', loadChildren: 'app/top/review/review.module#ReviewModule'},
                        {path: 'request', loadChildren: 'app/top/request/request.module#RequestModule'},
                        {path: 'suggestion/plan', loadChildren: 'app/top/suggestion/plan/plan.module#PlanModule'},
                        {path: 'legal', component: TermsComponent},
                        {path: 'article', component: ArticleComponent},
                        {path: 'company', component: AboutCompanyComponent},
                        {path: 'cancelpolicy', component: CancelPolicyComponent},
                        {path: 'privacypolicy', component: PrivacyPolicyComponent},
                        {path: 'usage', component: HowToUseComponent},
                        {path: 'about', component: AboutComponent},
                        {path: 'safety', component: SafetyComponent},
                        {path: 'question', component: QuestionAnswersComponent},
                        {path: 'travel_bussiness', component: TravelBussinessComponent},
                        {path: 'policy', component: PolicyComponent},
                        {path: 'mypage', loadChildren: 'app/top/mypage/mypage.module#MypageModule'},
                        {path: 'mypage/suggestion', loadChildren: 'app/top/mypage/suggestion/suggestion.module#SuggestionModule'},
                        {path: 'mypage/plan', loadChildren: 'app/top/mypage/plan/plan.module#PlanModule'},
                        {path: 'mypage/proposal_plan', loadChildren: 'app/top/mypage/proposal_plan/proposal_plan.module#ProposalPlanModule'},
                        {path: 'page', loadChildren: 'app/top/page/page.module#PageModule'}
                    ]
                },


            ]
        },
        {
            path: '',
            component: MemberLayoutComponent,
            children: [
                {path: '',
                    children: [
                        {path: 'member', loadChildren: 'app/top/member/member.module#MemberModule'},
                        {path: 'page/members/forgot-password/:extra_token', component: TopForgotPasswordComponent},
                        {path: 'page/members/active/:extra_token', component: MemberActiveComponent}
                    ]
                },
                {path: ':language',
                    children: [
                        {path: 'member', loadChildren: 'app/top/member/member.module#MemberModule'},
                        {path: 'page/members/forgot-password/:extra_token', component: TopForgotPasswordComponent},
                        {path: 'page/members/active/:extra_token', component: MemberActiveComponent}
                    ]
                },

            ]
        },
    ];

@NgModule({
    imports: [
        RouterModule.forChild(topRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class TopRoutingModule {
}
