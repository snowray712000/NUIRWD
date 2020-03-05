import { AbvService } from './abv.service';
import {  HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { initialTestBedAndAppInstance } from './initialTestBedAndAppInstance';

describe('AbvService', () => {
  beforeEach(() => {
    const testing = initialTestBedAndAppInstance(test01());
  });

  it('abv.php 值', (done) => {
    const service = new AbvService();
    service.queryAbvPhpOrCache().toPromise().then(a1 => {

      expect(a1.record[0].book).toBe('unv');
      expect(a1.record[0].cname).toBe('和合本');
      expect(a1.record[1].book).toBe('ncv');
      expect(a1.record[1].cname).toBe('新譯本');
    }).finally(() => {
      done();
    });
  });
});

function test01() {
  // import { of } from 'rxjs';
  const obj = {
    status: 'success',
    parsing: '2020/1/1 00:00:00',
    comment: '1970/1/1 12:34:56',
    record_count: 3,
    record: [
      { book: 'unv', cname: '和合本' },
      { book: 'ncv', cname: '新譯本' },
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
