import { VerseRange } from './VerseRange';
import { VerseAddress } from './VerseAddress';
import { BibleVersionQueryService } from 'src/app/fhl-api/bible-version-query.service';
import { initialTestBedAndAppInstance } from 'src/app/fhl-api/initialTestBedAndAppInstance';
import { BookNameLang } from 'src/app/const/BookNameLang';
import { Type } from '@angular/core';

describe('VerseRange', () => {
  beforeEach(() => {
    const testing = initialTestBedAndAppInstance();
  });

  it('01-產生標準字串，不含#與|', () => {
    const r1 = new VerseRange();
    r1.add(new VerseAddress(40, 1, 1));
    r1.add(new VerseAddress(40, 1, 2));
    r1.add(new VerseAddress(40, 1, 3));

    expect(r1.toStringChineseShort()).toBe('太 1:1-3');
  });

  it('02-指定版本', (done) => {
    const r1 = new VerseRange();
    r1.add(new VerseAddress(40, 1, 1, 2));
    r1.add(new VerseAddress(40, 1, 2, 2));

    const r2 = new BibleVersionQueryService().queryBibleVersions();

    expect(r1.toStringChineseShort()).toBe(`太 1:1-2(${r2[2].naChinese})`);
    done();
  });
  it('03-合併-跨3章', () => {
    const r1 = new VerseRange();
    r1.add(new VerseAddress(40, 1, 23));
    r1.add(new VerseAddress(40, 1, 24));
    r1.add(new VerseAddress(40, 1, 25)); // 馬太 1:25 2:23 是最後一節
    for (let index = 1; index <= 23; index++) {
      r1.add(new VerseAddress(40, 2, index));
    }
    r1.add(new VerseAddress(40, 3, 1));
    r1.add(new VerseAddress(40, 3, 2));

    expect(r1.toStringChineseShort()).toBe('太 1:23-3:2');
  });
  it('04-不含合併', () => {
    const r1 = new VerseRange();   // {1:[(1,3),(6,7),(21,21),(25,25)] 2:[(2,3),(7,8)]}
    r1.add(new VerseAddress(40, 1, 1));
    r1.add(new VerseAddress(40, 1, 2));
    r1.add(new VerseAddress(40, 1, 3));
    r1.add(new VerseAddress(40, 1, 6));
    r1.add(new VerseAddress(40, 1, 7));
    r1.add(new VerseAddress(40, 1, 21));
    r1.add(new VerseAddress(40, 1, 25)); // 馬太1:25是最後一節
    r1.add(new VerseAddress(40, 2, 2));
    r1.add(new VerseAddress(40, 2, 3));
    r1.add(new VerseAddress(40, 2, 7));
    r1.add(new VerseAddress(40, 2, 8));

    expect(r1.toStringChineseShort()).toBe('太 1:1-3,6-7,21,25,2:2-3,7-8');
  });
  it('05-跨卷', () => {
    const r1 = new VerseRange();
    r1.add(new VerseAddress(40, 1, 23));
    r1.add(new VerseAddress(40, 1, 24));
    r1.add(new VerseAddress(39, 1, 2));
    r1.add(new VerseAddress(39, 1, 3));

    expect(r1.toStringChineseShort()).toBe('瑪 1:2-3;太 1:23-24');
  });
  it('06-英文中文', () => {
    const r1 = new VerseRange();
    r1.add(new VerseAddress(40, 1, 23));
    r1.add(new VerseAddress(40, 1, 24));

    expect(r1.toStringEnglishShort()).toBe('Mt 1:23-24');
    expect(r1.toStringChineseShort()).toBe('太 1:23-24');
  });
});
