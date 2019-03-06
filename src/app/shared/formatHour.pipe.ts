// Load html in Angular 2

// In content.html use:

import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'formatHour'})
export class FormatHourPipe implements PipeTransform {
    transform(value:string) {
        if(value) {
            let value_exp = value.split(":");
            let time_required = "";
            if(value_exp[1] == '15') {
                time_required = value_exp[0] + '.' + '25';
            } else if(value_exp[1] == '30') {
                time_required = value_exp[0] + '.' + '50';
            } else if(value_exp[1] == '45') {
                time_required = value_exp[0] + '.' + '75';
            } else {
                time_required = value_exp[0] + '.' + '00';
            }
            return time_required;
        } else {
            return null;
        }
    }
}