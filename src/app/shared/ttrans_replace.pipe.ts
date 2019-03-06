/**
 * Created by root on 13/12/2017.
 */
import { Pipe, PipeTransform } from '@angular/core';
import { NAME_EN, TRANS_EN } from './top-translation/lang/en';
import { NAME_JA, TRANS_JA } from './top-translation/lang/ja';
import { NAME_CHINA, TRANS_CHINA } from './top-translation/lang/china';
import { storage } from './localStorageAsCookie';

@Pipe({
    name: 'ttrans_replace'
})
export class ReplacePipe implements PipeTransform {

    dictionary =
        {
            [NAME_EN]: TRANS_EN,
            [NAME_JA]: TRANS_JA,
            [NAME_CHINA]: TRANS_CHINA
        };

    constructor(){}

    /**
     *
     * @param value string
     * @returns string
     */
    public transform(value): any
    {
        let curLang = this.getConfig('TOP_LANG','en');
        let returnValue = value;
        if (this.dictionary[curLang] && this.dictionary[curLang][value])
        {
            returnValue = this.dictionary[curLang][value];
        }

        if (arguments.length > 0) {
            let find = [];
            let replace = [];
            let tmp = "";
            for (let i=1; i < arguments.length; i++) {
                tmp = '{' + (i-1) + '}';
                find[i-1] = tmp;
                replace[i-1] = arguments[i];
            }

            returnValue = this.str_replace(find, replace, returnValue);
        }
        // remove Fxx_ from [returnValue]
        returnValue = this.removePrefixOfScreen(returnValue);
        return returnValue;
    }

    getConfig(key,defaultValue?)
    {
        if(storage.isSupported()){
            if (localStorage.getItem(key) !== null)
            {
                return  localStorage.getItem(key);
            }
            else
            {
                return defaultValue;
            }
        } else {
            return storage.getItem(key, defaultValue);
        }
    }

    str_replace($f, $r, $s){
        return $s.replace(new RegExp("(" + (typeof($f) == "string" ? $f.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&") : $f.map(function(i){return i.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")}).join("|")) + ")", "g"), typeof($r) == "string" ? $r : typeof($f) == "string" ? $r[0] : function(i){ return $r[$f.indexOf(i)]});
    }

    /**
     * Input Fxx_Fyy_abcd
     * @param str
     * @returns {string} abcd
     */
    removePrefixOfScreen(str: any) {
        if (typeof str === 'string' && str.indexOf('F') === 0 && str.indexOf('_') === 3) {
            str = str.substr(4);
            return this.removePrefixOfScreen(str);
        }
        return str;
    }
}