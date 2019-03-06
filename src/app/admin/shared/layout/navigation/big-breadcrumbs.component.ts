import {Component, OnInit, Input} from '@angular/core';

@Component({

  selector: 'sa-big-breadcrumbs',
  template: `
   <div><h1 class="page-title txt-color-blueDark">
   <i class="fa-fw fa fa-{{icon}}"></i>
   <span *ngFor="let item of items; let i = index">
        <span *ngIf="item[1]; then hasLink else notLink"></span>
        <ng-template #hasLink><a [routerLink]="[item[1]]"><span *ngIf="i != 0">&nbsp;></span> {{item[0]}}</a></ng-template>
        <ng-template #notLink><span><span *ngIf="i != 0">&nbsp;></span> {{item[0]}}</span></ng-template>
   </span>
   </h1></div>
  `,
})
export class BigBreadcrumbsComponent implements OnInit {

  @Input() public icon: string;
  @Input() public items: Array<string>;


  constructor() {}

  ngOnInit() {
  }

}
