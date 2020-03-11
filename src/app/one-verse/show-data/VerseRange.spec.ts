import { VerseRange } from './VerseRange';
import { VerseAddress } from './VerseAddress';
import { BibleVersionQueryService } from 'src/app/fhl-api/bible-version-query.service';
import { initialTestBedAndAppInstance } from 'src/app/fhl-api/initialTestBedAndAppInstance';

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
  it('061-整章', () => {
    const r1 = new VerseRange();
    for (let index = 1; index <= 25; index++) {
      r1.add(new VerseAddress(40, 1, index));
    }
    expect(r1.toStringEnglishShort()).toBe('Mt 1');
  });
  it('062-整章', () => {
    const r1 = new VerseRange();
    r1.add(new VerseAddress(40, 1, 1));

    for (let index = 1; index <= 23; index++) {
      r1.add(new VerseAddress(40, 2, index));
    }

    r1.add(new VerseAddress(40, 3, 2));
    r1.add(new VerseAddress(40, 3, 3));
    expect(r1.toStringEnglishShort()).toBe('Mt 1:1,2:1-23,3:2-3', '只有1個時才能變為整章');
  });
  it('063-整章', () => {
    const r1 = new VerseRange();
    for (let index = 1; index <= 25; index++) {
      r1.add(new VerseAddress(40, 1, index));
    }
    for (let index = 1; index <= 17; index++) {
      r1.add(new VerseAddress(40, 3, index));
    }
    expect(r1.toStringEnglishShort()).toBe('Mt 1:1-25,3:1-17', '只有1個時才能變為整章');
  });

  it('07a-開發實驗', () => {
    const r1 = '瑪 1:2-3;太1:23-24'.split(';');
    // console.log(r1); // ["瑪 1:2-3", "太 1:23-24"]

    const r2 = new RegExp('(瑪|太)(\\s*)([0-9:\\-,]+)');
    // console.log('瑪 1:2-3'.match(r2)); // ["瑪 1:2-3", "瑪", " ", "1:2-3", ...]
    // console.log('瑪1:2-3'.match(r2)); // ["瑪 1:2-3", "瑪", "", "1:2-3", ...]

    const r3 = new RegExp('(瑪|太)(\\s*)([0-9:\\-,]+)');
    // console.log('太 1:1-3,6-7,21,25,2:3-5'.match(r3)); // ["太 1:1-3,6-7,21,25,2:3-5", "太", " ", "1:1-3,6-7,21,25,2:3-5", index: 0,
    // console.log('1:1-3,6-7,21,25,2:3-5'.match(r3)); // null

    const r4 = new RegExp('(瑪|太){0,1}(\\s*)([0-9:\\-,]+)');
    // tslint:disable-next-line: max-line-length
    // console.log('1:1-3,6-7,21,25,2:3-5'.match(r4)); // ["1:1-3,6-7,21,25,2:3-5", undefined, "", "1:1-3,6-7,21,25,2:3-5", index: 0, input: "1:1-3,6-7,21,25,2:3-5"
    expect(1).toBe(1);

    const r5 = new RegExp('([0-9:]+)-([0-9:]+)');
    // console.log('1:1-3'.match(r5)); // ["1:1-3", "1:1", "3",
    // console.log('6-7'.match(r5)); // ["6-7", "6", "7",
    // console.log('21'.match(r5)); // null
    // console.log('2:3-5'.match(r5)); // ["2:3-5", "2:3", "5",

    // 類型
    // 1:32-2:31
    // 1:2-32
    // 23 (23節 或 23章)
    const r6 = new RegExp('(\\d+):(\\d+)-(\\d+):(\\d+)');
    // console.log(JSON.stringify('11:32-2:31'.match(r6)) ); // ["11:32-2:31","11","32","2","31"
    // console.log('11:12-31'.match(r6)); // null

    const r7 = new RegExp('(\\d+):(\\d+)-(\\d+)');
    // console.log('11:32-2:31'.match(r7)); // ["11:32-2", "11", "32", "2" ...
    // console.log(JSON.stringify('11:2-31'.match(r7)) ); // ["11:2-31","11","2","31"]
  });
  it('07-parsing', () => {
    expect(VerseRange.fromReferenceDescription('太 1:23-24', 40).toStringEnglishShort())
      .toBe('Mt 1:23-24', '基本');
    expect(VerseRange.fromReferenceDescription('瑪 1:2-3;太 1:23-24', 40).toStringEnglishShort())
      .toBe('Mal 1:2-3;Mt 1:23-24', '多卷');
  });
  it('08-parsing-略卷名', () => {
    expect(VerseRange.fromReferenceDescription('1:23-24', 40).toStringEnglishShort())
      .toBe('Mt 1:23-24', '略卷名');
    expect(VerseRange.fromReferenceDescription('瑪 1:2-3;1:23-24', 40).toStringEnglishShort())
      .toBe('Mal 1:2-3;Mt 1:23-24', '多卷又略卷名');
  });
  it('09-parsing-單卷數節', () => {
    expect(VerseRange.fromReferenceDescription('太 1:1-3,6-7,21,25', 40).toStringEnglishShort())
      .toBe('Mt 1:1-3,6-7,21,25', '有2節以上,單節.');
    expect(VerseRange.fromReferenceDescription('太 1:1-3,6-7,21,25,2:3-5', 40).toStringEnglishShort())
      .toBe('Mt 1:1-3,6-7,21,25,2:3-5', '多節多章');
  });
  it('10-parsing-跨章', () => {
    expect(VerseRange.fromReferenceDescription('太 1:23-3:2', 40).toStringEnglishShort())
      .toBe('Mt 1:23-3:2', '跨3章');
    expect(VerseRange.fromReferenceDescription('太 1:23-3:2,3:5-7', 40).toStringEnglishShort())
      .toBe('Mt 1:23-3:2,3:5-7', '跨3章,接一個');
  });
  it('11-parsing-沒空格', () => {
    expect(VerseRange.fromReferenceDescription('太1:23-24', 40).toStringEnglishShort())
      .toBe('Mt 1:23-24');
    expect(VerseRange.fromReferenceDescription('Mt1:23-24', 40).toStringEnglishShort())
      .toBe('Mt 1:23-24');
  });
  it('12-parsing-各種卷名', () => {
    expect(VerseRange.fromReferenceDescription('Matt 1:23-24', 40).toStringEnglishShort())
      .toBe('Mt 1:23-24');
    expect(VerseRange.fromReferenceDescription('Matthew 1:23-24', 40).toStringEnglishShort())
      .toBe('Mt 1:23-24');
    expect(VerseRange.fromReferenceDescription('馬太福音 1:23-24', 40).toStringEnglishShort())
      .toBe('Mt 1:23-24');
    expect(VerseRange.fromReferenceDescription('马太福音 1:23-24', 40).toStringEnglishShort())
      .toBe('Mt 1:23-24');
  });
});
