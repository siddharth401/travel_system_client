import { Pipe, PipeTransform } from '@angular/core';
import { NAME_EN, TRANS_EN } from './lang/en';
import { NAME_JA, TRANS_JA } from './lang/ja';
import { NAME_CHINA, TRANS_CHINA } from './lang/china';
import { storage } from '../localStorageAsCookie';

@Pipe({
  name: 'ttrans',
  pure: false
})
export class TopTranslationPipe implements PipeTransform
{
  dictionary =
  {
    [NAME_EN]: TRANS_EN,
    [NAME_JA]: TRANS_JA,
    [NAME_CHINA]: TRANS_CHINA
  };

  constructor(){}

  public transform(value: any, args?: any): any
  {
    let curLang = this.getConfig('TOP_LANG') ? this.getConfig('TOP_LANG') : 'ja';
    if (this.dictionary[curLang] && this.dictionary[curLang][value])
    {
      value = this.dictionary[curLang][value];
    }

    // remove Fxx_ from [value]
    value = this.removePrefixOfScreen(value);
    return value;
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
