import { BibleVersionQueryService } from './bible-version-query.service';
import { of } from 'rxjs';
import { ApiAbv, DAbvResult, AbvResult } from './ApiAbv';
import { map } from 'rxjs/operators';
import { initialTestBedAndAppInstance } from './initialTestBedAndAppInstance';
function test01() {
  const re = [
    {
      book: 'unv',
      cname: '和合本',
      proc: 0,
      strong: 1,
      ntonly: 0,
      candownload: 1,
      otonly: 0,
      version: '2020/02/06 05:50:01',
    },
    {
      book: 'ncv',
      cname: '新譯本',
      proc: 0,
      strong: 0,
      ntonly: 0,
      candownload: 0,
      otonly: 0,
      version: '',
    },
  ];
  return of({
    status: 'success',
    parsing: '2020/02/20 05:50:02',
    comment: '2020/02/20 06:02:35',
    record_count: re.length,
    record: re
  }).pipe(map(a1 => {
    const r1 = new AbvResult();
    r1.comment = new Date(a1.comment);
    r1.parsing = new Date(a1.parsing);
    r1.record = a1.record;
    r1.record_count = r1.record.length;
    return r1 as DAbvResult;
  }));
}

describe('BibleVersionQueryService', () => {
  beforeEach(() => {
  });

  it('Bible Version Query Service', (done) => {
    const abv = new ApiAbv();
    spyOn(abv, 'queryAbvPhpOrCache').and.returnValue(test01());
    const service = new BibleVersionQueryService(abv);
    service.queryBibleVersionsAsync().toPromise().then(a1 => {
      expect(a1[0].na).toBe('unv');
      expect(a1[1].na).toBe('ncv');
      done();
    });
  });
});

