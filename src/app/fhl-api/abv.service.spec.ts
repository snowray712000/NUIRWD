import { TestBed } from '@angular/core/testing';
import { AbvService, IAbvResult } from './abv.service';
import { HttpClientModule, HttpClient, HttpResponse } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { promise } from 'protractor';

describe('AbvService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
  });

  it('abv.php 值', (done) => {
    const service: AbvService = TestBed.get(AbvService);
    const sr1 = TestBed.get(HttpClient);
    spyOn(sr1, 'get').and.returnValue(test01());
    service.queryAbvPhpOrCache().toPromise().then(a1 => {
      expect(a1.record[0]).toEqual({ book: 'unv', cname: '合和本' });
      expect(a1.record[1]).toEqual({ book: 'cnv', cname: '新譯本' });
    }).finally(() => {
      done();
    });
  });

  // it('404 值, 從localStorage取得', (done) => {
  //   const service: AbvService = TestBed.get(AbvService);
  //   const sr1 = TestBed.get(HttpClient);
  //   spyOn(sr1, 'get').and.returnValues(test01(), test02());
  //   service.queryAbvPhpOrCache().toPromise().then(step1 => {
  //     service.queryAbvPhpOrCache().toPromise().then(a1 => {
  //       expect(a1.record[0]).toEqual({ book: 'unv', cname: '合和本' });
  //       expect(a1.record[1]).toEqual({ book: 'cnv', cname: '新譯本' });
  //     }).finally(() => {
  //       expect(service).toBeTruthy();
  //       done();
  //     });
  //   });
  // });

});


function test01() {
  // import { of } from 'rxjs';
  const obj = {
    status: 'success',
    parsing: '2020/1/1 00:00:00',
    comment: '1970/1/1 12:34:56',
    record_count: 3,
    record: [
      { book: 'unv', cname: '合和本' },
      { book: 'cnv', cname: '新譯本' },
    ]
  };
  const re2 = new HttpResponse<string>({ body: JSON.stringify(obj), status: 200 });
  return of(re2);
}
function test02() {
  const obj = {};
  const re2 = new HttpResponse<string>({ body: JSON.stringify(obj), status: 404 });
  throw Error('404 not found.');
  return of(re2);
}
