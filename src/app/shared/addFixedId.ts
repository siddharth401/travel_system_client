import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'addFixedId'
})
export class AddFixedIdPipe implements PipeTransform
{
    transform(value, defaultItem?: string) : any
    {
        var stringId = "";
        if(value.toString().length < 5) {
            let default_str = "";
            for (let i = 0; i < 5 - value.toString().length; i++)
            {
                default_str += "0";
            }
            stringId = defaultItem + default_str +value;
        } else {
            stringId = defaultItem + value;
        }
        return stringId;
    }
}