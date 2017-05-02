import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { HttpClientService } from './http-client';
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
import * as authGlobals from './auth.globals';
import * as moment from 'moment';

@Injectable()
export class UserService {
    private _userID: String;
    private _userObject: Object;
    private _obsUser: Observable<any>;
    private _billingData: Object;
    private _periodBillingData: Object = {};
    private _obsBilling: Observable<any>;
    private _clients: Object;
    private _obsClients: Observable<any>;

    private _hours: Object;
    private _obsHours: Observable<any>;

    private _billingRequestParms: Object;
    public requestedComponent: Object;
    constructor(private http: HttpClientService) {
        this._userID = localStorage["user_name"];
    }
    getHours(): Observable<any> {
        var api = authGlobals.apiBase + 'api/ABS/GetHours'
        return this.http
            .post(api, this._billingRequestParms)
            .map(response => {
                this._obsHours = null;
                if (response.status == 400) {
                    return "FAILURE";
                } else if (response.status == 200) {
                    this._hours = response.json();
                    return this._hours;
                }
            }
            ).share()
            .catch(this.handleError);
    }

    getClients(): Observable<any> {
        var api = authGlobals.apiBase + 'api/ABS/Clients'
        if (this._clients) {
            return Observable.of(this._clients);
        } else if (this._obsClients) {
            return this._obsClients;
        } else {
            this._obsClients = this.http
                .get(api)
                .map(response => {
                    this._obsClients = null;
                    if (response.status == 400) {
                        return "FAILURE";
                    } else if (response.status == 200) {
                        this._clients = response.json();
                        return this._clients;
                    }
                }
                ).share()
                .catch(this.handleError);
            return this._obsClients
        }
    }

    getProjectCodes(clientCode): Observable<any> {
        var api = authGlobals.apiBase + 'api/ABS/GetProjectCodes'
        return this.http
            .post(api, {clientCode: clientCode})
            .map(response => {
                if (response.status == 400) {
                    return "FAILURE";
                } else if (response.status == 200) {
                    return response.json();
                }
            }
            ).share()
            .catch(this.handleError);
    }    
    getPeriodBillings(billingPeriod): Observable<any> {
        var api = authGlobals.apiBase + 'api/ABS/PeriodBillings';
        this._userID = localStorage["user_name"];
        if (this._periodBillingData[billingPeriod]) {
            return Observable.of(this._periodBillingData[billingPeriod]);
        } else if (this._obsBilling) {
            return this._obsBilling;
        } else {
            this._obsBilling = this.http
                .post(api, { user: this._userID, period: billingPeriod })
                .map(response => {
                    this._obsBilling = null;
                    if (response.status == 400) {
                        return "FAILURE";
                    } else if (response.status == 200) {
                        this._billingData = response.json();
                        this._periodBillingData[billingPeriod] = response.json();
                        return this._periodBillingData[billingPeriod];
                    }
                }
                ).share()
                .catch(this.handleError);
            return this._obsBilling
        }
    }
    getUserInstance(userID): Observable<any> {
        this._userID = userID || localStorage["user_name"];
        var api = authGlobals.apiBase + 'api/ABS/UserProfile';
        if (this._userObject) {
            return Observable.of(this._userObject);
        } else if (this._obsUser) {
            return this._obsUser;
        } else {
            this._obsUser = this.http
                .post(api, { user: userID })
                .map(response => {
                    this._obsUser = null;
                    if (response.status == 400) {
                        return "FAILURE";
                    } else if (response.status == 200) {
                        this._userObject = response.json();
                        return this._userObject;
                    }
                }
                ).share()
                .catch(this.handleError);
            return this._obsUser
        }
    }
    myUserObject(): Observable<any> {
        if (this._userObject) {
            return Observable.of(this._userObject);
        } else {
            return this.getUserInstance(localStorage["user_name"]);
        }
    }

    saveMyClients(clients): Observable<any> {
        var api = authGlobals.apiBase + 'api/ABS/SaveMyClients';
        var clientsFor = { selectedClients: clients, userId: this._userID };
        return this.http
            .post(api, clientsFor)
            .map(response => {
                if (response.status == 400) {
                    return "FAILURE";
                } else if (response.status == 200) {
                    this._userObject['myClients'] = response.json();
                    return this._userObject['myClients'];
                }
            }
            ).catch(this.handleError);
    }
    setHoursRequestParms(bp, dos) {
        this._billingRequestParms = { billingPeriod: bp, sysAnalystId: this._userID, dateOfService: dos };
        return Observable.of(this._billingRequestParms);
    }
    setRequestedComponent(requestedComponent) {
        this.requestedComponent = requestedComponent
/*        if (requestedComponent.name === 'hoursList') {
            let billingPeriod = moment().format('YYYYMM');
            let dateOfService = moment().format('DD-MMM-YYYY').toString().toUpperCase();
            this.requestedComponent = { name: requestedComponent.name, description: 'Billable Hours for: ' + moment().format('MM/DD/YYYY').toString() };
            console.log('Billing Period', billingPeriod);
            console.log('Date of Service', dateOfService);
            this.setHoursRequestParms(billingPeriod, dateOfService)
                .subscribe((response) => {

                    return Observable.of(this.requestedComponent);
                });
        }*/

        return Observable.of(this.requestedComponent);


    }
    getRequestedComponent() {
        return this.requestedComponent;
    }
    getBillingRequestParms() {
        console.log('Billing Request Parms', this._billingRequestParms);
        return this._billingRequestParms;
    }
    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server Error');
    }

    CYP() {
        return '201701';
    }

}