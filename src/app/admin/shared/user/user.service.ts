import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs/Rx";

@Injectable()
export class UserService {

  public user: Subject<any>;

  public userInfo = {
    username: 'Guest'
  };

  constructor() {

  }
}
