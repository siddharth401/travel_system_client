import {Injectable} from "@angular/core";
import {Resolve,ActivatedRouteSnapshot } from '@angular/router';
import {Http} from '@angular/http';
import {constant} from "./constant";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

@Injectable()
export class EnvService implements Resolve<any>
{
  constructor(private http: Http)
  {}

  resolve(route: ActivatedRouteSnapshot): Promise<any> | boolean
  {
    return this.http.get(constant.BASE_API + 'commons/env').toPromise().then(res =>
    {
      if(res)
      {
        let env = res.json();
        window['env'] = env; return true;
      } else {return false;}
    });
  }
}