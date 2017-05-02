import { Inject } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { UserService } from '../../user.service';
//import { PushNotificationComponent } from '../../theme/components';

import * as authGlobals from '../../auth.globals';

import 'style-loader!./login.scss';

@Component({
  selector: 'login',
  templateUrl: './login.html'
})
export class Login {

  public form: FormGroup;
  public username: AbstractControl;
  public password: AbstractControl;
  public submitted: boolean = false;
  public submitting: boolean = false;

//, private _pushNotify: PushNotificationComponent, private _userService: UserService
  constructor(fb: FormBuilder, private http: Http, private router: Router) {
    this.form = fb.group({
      'username': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.username = this.form.controls['username'];
    this.password = this.form.controls['password'];
  }

  public autoFillForm() {
    this.form.patchValue({ username: 'rdw' });
    this.form.patchValue({ password: '0ff1c3RDW' });
    this.onSubmit(this.form.value);
  }
  public onSubmit(values: Object): void {
    this.submitting = true;
    if (this.form.valid) {

      var dataForBody = "grant_type=password&" +
        "username=" + encodeURI(values["username"]) + "&" +
        "password=" + encodeURI(values["password"]) + "&" +
        "scope=" + encodeURI("absdeveloper");
      var encodedClientIdAndSecret = btoa("absROPC:Th1s1sMyR4nd0mCl13ntS3cr3t!");
      var messageHeaders = new Headers();
      messageHeaders.append('Content-Type', 'application/x-www-form-urlencoded')
      messageHeaders.append('Authorization', 'Basic ' + encodedClientIdAndSecret)
      this.http.post(authGlobals.tokenEndpoint, dataForBody, {
        headers: messageHeaders
      })
        .map(res => res.json())
        .subscribe(
        (data) => {
          this.saveToken(data.access_token);
          this.submitted = true;
        }
        );
    }
  }

    ngOnInit() {
      localStorage.clear();
    this.submitting = false;
  }

  absSignIn(provider: string) {
    var url = authGlobals.authorizationEndpoint +
      "client_id=absImplicit&" +
      "redirect_uri=" + encodeURI(window.location.protocol + "//" + window.location.host + "/callback.html") + "&" +
      "response_type=token&" +
      "scope=absdeveloper";
    window.location.href = url;
  }
  saveToken(token) {
    localStorage["user_name"] = this.username.value;
    localStorage["access_token"] = token;
    this.router.navigate(["pages/dashboard", {}]);
/*    this._userService.getUserInstance(this.username.value).subscribe(result => {
      this._pushNotify.show({
        title: 'Authentication Success',
        body: 'Welcome back ' + result.userAccount.userName
      })
      this.router.navigate(["pages/dashboard", {}]);
    });*/
  }
}
