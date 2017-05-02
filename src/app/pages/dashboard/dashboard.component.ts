import { Component, OnInit } from '@angular/core';
import { DataService } from "app/data.service";
import { SignalR, SignalRConnection } from 'ng2-signalr';

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  demoData: Object;
  srMessages: Array<Object>;

  constructor(private _dataService: DataService, private _signalR: SignalR) {
    this._dataService.getDemoData()
      .subscribe(result => {
        this.demoData = result;
      });
  }

  ngOnInit() {
    this.srMessages = [];
    this._signalR.connect().then((c) => {
      let onMessageSent$ = c.listenFor('broadcastMessage');
      onMessageSent$.subscribe(msg => {
        this.srMessages.push(msg);
        
      
      });
    });



  }
}
