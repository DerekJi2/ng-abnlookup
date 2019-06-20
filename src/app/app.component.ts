import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { FormControl } from '@angular/forms';
import { timer, from, of } from 'rxjs';
import { map, concatMap, filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ng-abnlookup';

  headLoc = document.getElementsByTagName('head').item(0);
  guid = '01bab6a5-e122-4b8d-85ee-b674053b6787';
  abn = '74172177893';
  abnCallback = 'abnCallback';
  requestCounter = 1;
  abnResult = new FormControl('');

  logs = [];

  public static callback(sth: string): void {
    console.log(sth);
  }

  ngOnInit() {
    this.abnResult.valueChanges.subscribe((val) => {
      this.log(val);
    });

  }

  checkAbn(): void {

    this.log('Checking ABN');
    const scriptObject = this.getScriptObject();

    this.log('Appending scriptObject');
    this.headLoc.appendChild(scriptObject);

    const that = this;
    // setTimeout(() => {
    //   const value = $('#abn-input').val();
    //   that.log(value);
    // }, 2000);
    this.pollUntilAbnResultReady();
  }

  pollUntilAbnResultReady() {
    timer(0, 200)
    .pipe(
      concatMap(() => of($('#abn-input').val()))
    )
    .pipe(filter(val => val !== ''))
    .pipe(take(1))
    .subscribe((val) => {
      this.log(val);
      $('#abn-input').val('');
    });
  }

  getScriptObject(): HTMLScriptElement {
    const noCacheIE = '&noCacheIE=' + (new Date()).getTime();
    // tslint:disable-next-line: max-line-length
    const url = `https://abr.business.gov.au/json/AbnDetails.aspx?callback=${this.abnCallback}&abn=${this.abn.trim()}&guid=${this.guid}&noCacheIE=${noCacheIE}`;
    this.log(url);

    const scriptId = 'sflScriptId' + this.requestCounter++;
    const scriptObject = document.createElement('script');
    scriptObject.setAttribute('type', 'text/javascript');
    scriptObject.setAttribute('src', url);
    scriptObject.setAttribute('class', 'abn-lookup-script');
    scriptObject.setAttribute('id', scriptId);

    return scriptObject;
  }

  log(msg: string): void {
    this.logs.push(msg);
  }

}
