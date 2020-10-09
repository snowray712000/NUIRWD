import { HeightCalc } from "./HeightCalc";
import { DOneLineHeight } from './one-ver/one-ver.component';
import { VerseRange } from '../bible-address/VerseRange';

describe('HeightCalc 併排', () => {
  it('只有一版本,不用設', () => {
    const test1 = new Map<string, DOneLineHeight[]>();
    test1.set('unv', [
      { addresses: VerseRange.fD('Ps8:1'), cy: 20, cy2: 30 }, // 期盼把30拿掉
      { addresses: VerseRange.fD('Ps8:2'), cy: 30 },
    ]);
    new HeightCalc().main(test1);
    expect(test1.get('unv')[0].cy2).toBe(undefined);
    // expect(re)
  });

  it('Case2-1三版本沒合併節', () => {
    const test1 = new Map<string, DOneLineHeight[]>();
    test1.set('v1', [
      { addresses: VerseRange.fD('Ps8:1'), cy: 20 },
      { addresses: VerseRange.fD('Ps8:2'), cy: 30 }, // 30
    ]);
    test1.set('v2', [
      { addresses: VerseRange.fD('Ps8:1'), cy: 40 }, // 40
      { addresses: VerseRange.fD('Ps8:2'), cy: 20 },
    ]);
    test1.set('v3', [
      { addresses: VerseRange.fD('Ps8:1'), cy: 25 },
      { addresses: VerseRange.fD('Ps8:2'), cy: 20 },
    ]);
    new HeightCalc().main(test1);
    expect(test1.get('v1')[0].cy2).toBe(40);
    expect(test1.get('v1')[1].cy2).toBe(30);
    expect(test1.get('v2')[0].cy2).toBe(40);
    expect(test1.get('v2')[1].cy2).toBe(30);
    expect(test1.get('v3')[0].cy2).toBe(40);
    expect(test1.get('v3')[1].cy2).toBe(30);
    // expect(re)
  });
  it('Case2-2三版本沒合併節,節有略', () => {
    const test1 = new Map<string, DOneLineHeight[]>();
    test1.set('v1', [
      { addresses: VerseRange.fD('Ps8:1'), cy: 20 },
      { addresses: VerseRange.fD('Ps8:2'), cy: 30 },
    ]);
    test1.set('v2', [
      // { addresses: VerseRange.fD('Ps8:1'), cy: 40 },
      { addresses: VerseRange.fD('Ps8:2'), cy: 20 },
    ]);
    test1.set('v3', [
      { addresses: VerseRange.fD('Ps8:1'), cy: 25 },
      // { addresses: VerseRange.fD('Ps8:2'), cy: 20 },
    ]);
    new HeightCalc().main(test1);
    expect(test1.get('v1')[0].cy2).toBe(25);
    expect(test1.get('v1')[1].cy2).toBe(30);
    expect(test1.get('v2')[0].cy2).toBe(30);
    expect(test1.get('v3')[0].cy2).toBe(25);
    // expect(re)
  });
  it('Case3-1-1合併節-三版本-合併節較矮', () => {
    const test1 = new Map<string, DOneLineHeight[]>();
    test1.set('v1', [
      { addresses: VerseRange.fD('Ps8:1-3'), cy: 20 }, // 變 30
    ]);
    test1.set('v2', [
      { addresses: VerseRange.fD('Ps8:1'), cy: 10 },
      { addresses: VerseRange.fD('Ps8:2'), cy: 10 },
      { addresses: VerseRange.fD('Ps8:3'), cy: 10 },
    ]);
    test1.set('v3', [
      { addresses: VerseRange.fD('Ps8:1'), cy: 5 },
      { addresses: VerseRange.fD('Ps8:2'), cy: 5 },
      { addresses: VerseRange.fD('Ps8:3'), cy: 5 }, // 20 +15
    ]);
    new HeightCalc().main(test1);
    expect(test1.get('v1')[0].cy2).toBe(30);
    expect(test1.get('v2')[0].cy2).toBe(10);
    expect(test1.get('v2')[1].cy2).toBe(10);
    expect(test1.get('v2')[2].cy2).toBe(10);
    expect(test1.get('v3')[0].cy2).toBe(5);
    expect(test1.get('v3')[1].cy2).toBe(5);
    expect(test1.get('v3')[2].cy2).toBe(20);
    // expect(re)
  });
  it('Case3-1-2-合併節-三版本-合併節較高', () => {
    const test1 = new Map<string, DOneLineHeight[]>();
    test1.set('v1', [
      { addresses: VerseRange.fD('Ps8:1-3'), cy: 40 }, // 變 40
    ]);
    test1.set('v2', [
      { addresses: VerseRange.fD('Ps8:1'), cy: 10 },
      { addresses: VerseRange.fD('Ps8:2'), cy: 10 },
      { addresses: VerseRange.fD('Ps8:3'), cy: 10 }, // 變 20 (+10)
    ]);
    test1.set('v3', [
      { addresses: VerseRange.fD('Ps8:1'), cy: 5 },
      { addresses: VerseRange.fD('Ps8:2'), cy: 5 },
      { addresses: VerseRange.fD('Ps8:3'), cy: 5 }, // 變 30 (+25)
    ]);
    new HeightCalc().main(test1);
    expect(test1.get('v1')[0].cy2).toBe(40);
    expect(test1.get('v2')[0].cy2).toBe(10);
    expect(test1.get('v2')[1].cy2).toBe(10);
    expect(test1.get('v2')[2].cy2).toBe(20);
    expect(test1.get('v3')[0].cy2).toBe(5);
    expect(test1.get('v3')[1].cy2).toBe(5);
    expect(test1.get('v3')[2].cy2).toBe(30);
    // expect(re)
  });
  it('Case3-2-2合併節-都是合併節,無對齊', () => {
    const test1 = new Map<string, DOneLineHeight[]>();
    test1.set('v1', [
      { addresses: VerseRange.fD('Ps8:1-3'), cy: 27 }, // 變 40
    ]);
    test1.set('v2', [
      { addresses: VerseRange.fD('Ps8:1-2'), cy: 14 }, // 變 14
      { addresses: VerseRange.fD('Ps8:3'), cy: 7 }, // 變 13
    ]);
    test1.set('v3', [
      { addresses: VerseRange.fD('Ps8:1'), cy: 5 }, // 變 5
      { addresses: VerseRange.fD('Ps8:2-3'), cy: 10 }, // 變 22
    ]);
    new HeightCalc().main(test1);
    expect(test1.get('v1')[0].cy2).toBe(27);
    expect(test1.get('v2')[0].cy2).toBe(14);
    expect(test1.get('v2')[1].cy2).toBe(13);
    expect(test1.get('v3')[0].cy2).toBe(5);
    expect(test1.get('v3')[1].cy2).toBe(22);
    // expect(re)
  });
  it('Case3-2-4合併節-都是合併節,無對齊,有略節-下面不對齊', () => {
    const test1 = new Map<string, DOneLineHeight[]>();
    test1.set('v1', [
      { addresses: VerseRange.fD('Ps8:1-3'), cy: 27 },
      { addresses: VerseRange.fD('Ps8:4-5'), cy: 18 },
    ]);
    test1.set('v2', [
      { addresses: VerseRange.fD('Ps8:1-2'), cy: 14 },
      { addresses: VerseRange.fD('Ps8:5'), cy: 7 },
    ]);
    test1.set('v3', [
      { addresses: VerseRange.fD('Ps8:2-3'), cy: 10 },
      { addresses: VerseRange.fD('Ps8:5-6'), cy: 10 },
    ]);
    new HeightCalc().main(test1);
    expect(test1.get('v1')[0].cy2).toBe(27);
    expect(test1.get('v1')[1].cy2).toBe(18);
    expect(test1.get('v2')[0].cy2).toBe(27);
    expect(test1.get('v2')[1].cy2).toBe(18);
    expect(test1.get('v3')[0].cy2).toBe(27);
    expect(test1.get('v3')[1].cy2).toBe(18);
    // expect(re)
  });
});
