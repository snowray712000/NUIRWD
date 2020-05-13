import { initialTestBedAndAppInstance } from './initialTestBedAndAppInstance';
import { ApiQsb, QsbArgs } from './qsb';
import { VerseRange } from '../bible-address/VerseRange';

describe('API-qsb.php', () => {
  it('qsb.php 值', (done) => {
    const args = new QsbArgs();
    args.qstr = 'Mt1:1-2;John1:1-2';
    const service = new ApiQsb();
    service.queryQsbAsync(args).toPromise().then(a1 => {
      expect(a1.status).toBe('success');
    }).finally(() => {
      done();
    });
  });
  it('qsb.php gb 繁簡', (done) => {
    const args = new QsbArgs();
    args.qstr = VerseRange.fromReferenceDescription('詩150', 40).toStringEnglishShort();
    args.isSimpleChinese = false;
    const service = new ApiQsb();
    service.queryQsbAsync(args).toPromise().then(a1 => {
      // tslint:disable-next-line: max-line-length
      expect(a1.record.map(a2 => a2.bible_text).join('')).toBe('你們要讚美耶和華！在　神的聖所讚美他！在他顯能力的穹蒼讚美他！要因他大能的作為讚美他，按著他極美的大德讚美他！要用角聲讚美他，鼓瑟彈琴讚美他！擊鼓跳舞讚美他！用絲弦的樂器和簫的聲音讚美他！用大響的鈸讚美他！用高聲的鈸讚美他！凡有氣息的都要讚美耶和華！你們要讚美耶和華！');

      args.isSimpleChinese = true;
      service.queryQsbAsync(args).toPromise().then(a3 => {
        // tslint:disable-next-line: max-line-length
        expect(a3.record.map(a2 => a2.bible_text).join('')).toBe('你们要赞美耶和华！在　神的圣所赞美他！在他显能力的穹苍赞美他！要因他大能的作为赞美他，按着他极美的大德赞美他！要用角声赞美他，鼓瑟弹琴赞美他！击鼓跳舞赞美他！用丝弦的乐器和箫的声音赞美他！用大响的钹赞美他！用高声的钹赞美他！凡有气息的都要赞美耶和华！你们要赞美耶和华！');
        done();
      });
    });
  });
  it('qsb.php version', (done) => {
    const args = new QsbArgs();
    args.qstr = 'Mt1:1';
    args.bibleVersion = 'recover';
    const service = new ApiQsb();
    service.queryQsbAsync(args).toPromise().then(a1 => {
      expect(a1.record[0].bible_text).toBe('耶穌基督，大衛的子孫，亞伯拉罕子孫的家譜：');
    }).finally(() => {
      done();
    });
  });
  it('qsb.php strong', (done) => {
    const args = new QsbArgs();
    args.qstr = 'Mt1:1';
    args.isExistStrong = true;
    const service = new ApiQsb();
    service.queryQsbAsync(args).toPromise().then(a1 => {
      // tslint:disable-next-line: max-line-length
      expect(a1.record[0].bible_text).toBe('亞伯拉罕<WG11>的後裔<WG5207>，大衛<WG1138>的子孫<WG5207>（後裔，子孫：原文是兒子；下同），耶穌<WG2424>基督<WG5547>的家<WG1078>譜<WG976>：');
    }).finally(() => {
      done();
    });
  });
});
