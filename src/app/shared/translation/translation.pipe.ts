import { Pipe, PipeTransform } from '@angular/core';
import { NAME_US, TRANS_US } from './lang/us';
import { NAME_JP, TRANS_JP } from './lang/jp';
import { storage } from '../localStorageAsCookie';

@Pipe({
  name: 'trans',
  pure: false
})
export class TranslationPipe implements PipeTransform
{
  dictionary =
  {
    [NAME_US]: TRANS_US,
    [NAME_JP]: TRANS_JP,
  };

  constructor(){}

  public transform(value: any, args?: any): any
  {
    let curLang = this.getConfig('LANG','us');
    if (this.dictionary[curLang] && this.dictionary[curLang][value])
    {
      return this.dictionary[curLang][value];
    }

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

}
