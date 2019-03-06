import {ErrorHandler, Inject, Injectable} from '@angular/core';
import {DOCUMENT } from '@angular/platform-browser';
import {Http, RequestOptions, Headers} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import {AppService} from "./app.service";

@Injectable()
export class MyErrorHandler implements ErrorHandler {

    constructor(
        @Inject(DOCUMENT) private document: any,
        private app: AppService,
        private http: Http
    ) {}

    handleError(error) {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        let options = new RequestOptions({ headers: headers });

        let formData:FormData = new FormData();
        formData.append('url', this.document.location.href);
        formData.append('type', error.name);
        formData.append('message', error.message);
        formData.append('stack', error.stack);

        this.http.post(this.app.constant.BASE_API + 'commons/saveError',  formData, options).toPromise().then((res) => {
            // document.write('Something went wrong! Please try to <a href="' + this.document.location.href + '">reload</a> this page.');
        });
    }
}
