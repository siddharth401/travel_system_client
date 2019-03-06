// Load html in Angular 2

// In content.html use:
// <span *ngIf="!month">{{item.min_price | numberFormat}}</span>円/人

import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'numberFormat'})
export class NumberFormatPipe implements PipeTransform {
    transform(value:number) {
        if(value) {
            let value_round = Math.round(value);
            return value_round.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else if(value == 0) {
            return 0;
        } else {
            return null;
        }
    }
}