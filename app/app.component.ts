import { Component } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/empty';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/multicast';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent {
  constructor(private http: Http) { }
  
  public getObsTimer() {
    let currentProgress = 0;
    return Observable.of('backend first call')
      .switchMap(_ => {
        return Observable.timer(0, 100)
          .multicast(
            () => new ReplaySubject(1),
            subject => subject.takeWhile(_ => currentProgress < 10).concat(subject.take(1))
          )
          .exhaustMap(_ => {
            return Observable.of('backend second call')
              .switchMap(response => {
                if (currentProgress === 10) {
                  return Observable.of('backend result call');
                }
                currentProgress++;
                return Observable.of(currentProgress);
              });
          });
      });
  }

  timerPoll() {
    const obs = Observable.forkJoin(this.getObsTimer(), this.getObsTimer());
    const subscribe = obs
      .subscribe(
        res => console.log(res),
        err => console.error(err),
        () => console.log('done')
      );
  }

  ngOnInit() {
    this.timerPoll();

    /*
    this.http.get('https://jsonplaceholder.typicode.com/posts/1').subscribe(
      res => console.log(res),
      err => console.log(err),
      () => console.log('http done')
    );
    */
  }
}
