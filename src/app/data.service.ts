import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/throw';
import { Router, Routes, Route } from '@angular/router';
import { HttpClientService } from './http-client';
//import authGlobals = require('./auth.globals');
import * as authGlobals from './auth.globals';

@Injectable()
export class DataService {
    result: Array<Object>;
    private _userMenu;
    constructor(private http: HttpClientService) { }

    getDemoData(): Observable<any> {
        var api = authGlobals.apiBase + 'api/LAB/GetDemoData'
        return this.http
            .get(api)
            .map(response => {
                if (response.status == 400) {
                    return "FAILURE";
                } else if (response.status == 200) {

                    let demoData = response.json();
                    console.log('Demo Data: ', demoData)
                    return demoData;
                }
            }
            ).catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        let msg = `Error status code ${error.status} at ${error.url}`;
        return Observable.throw(msg);
    }
}




