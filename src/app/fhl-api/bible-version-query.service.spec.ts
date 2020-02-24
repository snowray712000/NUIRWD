import { TestBed } from '@angular/core/testing';
import { BibleVersionQueryService } from './bible-version-query.service';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { AbvService } from './abv.service';
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
  });
}

describe('BibleVersionQueryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ]
    });
    const sr = TestBed.get(AbvService);
    //const fnOri = spyOn(sr, 'queryAbvPhpOrCache').and.callThrough();
    spyOn(sr, 'queryAbvPhpOrCache').and.returnValue(test01());
  });

  it('should be created', (done) => {
    const service: BibleVersionQueryService = TestBed.get(BibleVersionQueryService);
    service.queryBibleVersions().toPromise().then(a1 => {
      expect(a1).toBeTruthy();
      done();
    });
  });

  // angular test spyOn mock 用法
  // https://jhlstudy.blogspot.com/2019/10/angular-unit-test-jasmine.html

});

