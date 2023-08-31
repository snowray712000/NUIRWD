import Enumerable from 'linq';
import { HttpRequest, HttpXhrBackend } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { lastValueFrom, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { delay, mergeMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dialog2b',
  templateUrl: './dialog2b.component.html',
  styleUrls: ['./dialog2b.component.css']
})
export class Dialog2bComponent implements OnInit {
  data: string[] = [];
  percent = 0;
  msg = 'ready';

  constructor() { }

  ngOnInit() {
    this.percent = 0;
    this.msg = 'ready';
    getData2bAsync().then(re => {
      this.data = re;
    });
  }
  onCancel() {
    console.log('cancel click');
  }
  onPause() {
    console.log('pause click');
  }
}

async function getData2bAsync(): Promise<string[]> {
  // const rrr = new AbortController(); // 有 .signal 變數. 有 .abort() 函式
  // const re: Promise<Response> = fetch('http://www.xxx.xxx.xxx/getData', { signal: rrr.signal });
  // setTimeout(() => {
  //   rrr.abort();
  // }, 5000);


  // ajax({ url: 'http://bkbible.fhl.net/json/se.php?q=摩西&limit=500' }).subscribe(
  //   { next: val => {
  //     console.log('next');
  //     console.log(val);
  //   }, error: err => {
  //     console.log('error');
  //     console.log(err);
  //   }, complete: () => {
  //     console.log('complete');
  //   } }
  // );

  const fnResp = {
    next: val => {
      console.log('next');
      console.log(val);
    }, error: err => {
      console.log('error');
      console.log(err);
    }, complete: () => {
      console.log('complete');
    }
  };

  const re1 = Enumerable.range(1, 66).select(i => ajax({ url: `http://bkbible.fhl.net/json/se.php?q=摩西&limit=500&RANGE=3&range_bid=${i}&range_eid=${i}` }))
    .toArray();
  Enumerable.from(re1).forEach(a1 => a1.subscribe(fnResp));

  // const url = 'http://bible.fhl.net/getData';
  // const xhr = new HttpRequest('GET', url);

  // const ts = new Date();
  // while (true) {
  //   if (new Date().getTime() - ts.getTime() > 3000)
  //     break;
  //   await sleep1(0);
  // }

  return ['1sec', '2sec', '3sec', '4sec', '5sec'];

  async function sleep1(ms: number): Promise<string[]> {
    return lastValueFrom(of([]).pipe(delay(ms)));
  }
}
