// Load html in Angular 2

// In content.html use:
// <span *ngIf="!month">{{item.text|nl2br}}</span>円/人

import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'nl2br'})
export class Nl2brPipe implements PipeTransform {
    transform(text:string) : string {
        if(text) {
            return text.replace(/(?:\r\n|\r|\n\<br>)/g, '<br />');
        } else {
            return text;
        }

    }
}