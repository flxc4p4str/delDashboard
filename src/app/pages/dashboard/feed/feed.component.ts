import { Component } from '@angular/core';

import { FeedService } from './feed.service';

import { SignalR, SignalRConnection } from 'ng2-signalr';

@Component({
  selector: 'feed',
  templateUrl: './feed.html',
  styleUrls: ['./feed.scss']
})
export class Feed {

  public feed: Array<Object>;

  constructor(private _feedService: FeedService, private _signalR: SignalR) {
    this.feed = [];
  }

  ngOnInit() {
        this._signalR.connect().then((c) => {
      let onMessageSent$ = c.listenFor('broadcastMessage');
      onMessageSent$.subscribe(msg => {
        this.feed.unshift(msg);
      });
    });
  }

  expandMessage(message) {
    message.expanded = !message.expanded;
  }

  private _loadFeed() {


  }
}
