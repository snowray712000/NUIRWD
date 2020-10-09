import { newLineNewLineSplit } from 'src/app/rwd-frameset/search-result-dialog/newLineNewLineSplit';
import { UT } from './UT';

const gFnSafe = UT.gFnSafe;
const equal = UT.equal;

export async function test_newLineNewLineSplit() {

  return gFnSafe(fns => {
    let src = newLineNewLineSplit([
      { w: '1' },
      { isBr: 1 }, { isBr: 1 },
      { w: '2' }, { isBr: 1 }, { w: '3' }
    ]);
    let dst = [
      [{ w: '1' }],
      [{ w: '2' }, { isBr: 1 }, { w: '3' }]
    ];
    fns.push(equal('01', dst, src));

    src = newLineNewLineSplit([
      { w: '1' },
      { isBr: 1 }, { isBr: 1 }, { isBr: 1 },
      { w: '2' }, { isBr: 1 }, { w: '3' }
    ]);
    dst = [
      [{ w: '1' }],
      [{ w: '2' }, { isBr: 1 }, { w: '3' }]
    ];
    fns.push(equal('02', dst, src, '多個換行'));

  }, 'newLineNewLineSplit exception');
}
