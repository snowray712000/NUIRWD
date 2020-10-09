import { DOneLineHeight } from './one-ver/one-ver.component';
import { HeightCalcWithoutMerge } from './HeightCalcWithoutMerge';
import { isLessThenAddress } from '../bible-address/DAddress';
import { HeightCalcWithMerge } from './HeightCalcWithMerge';
export class HeightCalc {
  private data: Map<string, DOneLineHeight[]>;
  main(data: Map<string, DOneLineHeight[]>) {
    this.data = data;
    if (data.size === 1) {
      this.resetCy2();
      return; // 只有一版本, 不用設
    }
    if (this.getIsExistMerge()) {
      new HeightCalcWithMerge().main(data);
    } else {
      new HeightCalcWithoutMerge().main(data);
    }
  }
  private getIsExistMerge() {
    let isExistMerge = false;
    for (const it1 of this.data) {
      for (const it2 of it1[1]) {
        if (it2.addresses.verses.length > 1) {
          isExistMerge = true;
          break;
        }
      }
      if (isExistMerge) {
        break;
      }
    }
    return isExistMerge;
  }
  private resetCy2() {
    for (const it1 of this.data) {
      for (const it2 of it1[1]) {
        delete it2.cy2;
      }
    }
  }
}
