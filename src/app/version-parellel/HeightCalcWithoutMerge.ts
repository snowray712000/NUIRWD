import { DOneLineHeight } from './one-ver/one-ver.component';
import { isTheSameAddress, DAddress, isLessThenAddress } from '../bible-address/DAddress';
/** HeightCalc 呼叫 */
export class HeightCalcWithoutMerge {
  private data: Map<string, DOneLineHeight[]>;
  main(data: Map<string, DOneLineHeight[]>) {
    this.data = data;
    const keys: string[] = [];
    const idxs: number[] = [];
    for (const it1 of this.data) {
      keys.push(it1[0]);
      idxs.push(0);
    }
    while (true) {
      const r1 = this.get000toAddrAddrAddr(idxs, keys);
      // console.log(r1);
      if (r1.filter(a1 => a1 !== undefined).length === 0) {
        break;
      }
      const r2 = this.getMinAddr(r1);
      // console.log(r2);
      const tft = this.getTrueFalseTrue(r1, r2);
      // console.log(r3);
      const cy2 = this.getMaxCy(keys, tft, idxs);
      // console.log(r4);
      this.setCy2(idxs, keys, tft, cy2);
      this.goNext(idxs, tft);
      // console.log(idxs);
    }
  }
  private goNext(idxs, tft) {
    for (let i = 0; i < tft.length; i++) {
      const it1 = tft[i];
      if (it1) {
        idxs[i]++;
      }
    }
  }
  private setCy2(idxs, keys, tft, cy2) {
    for (let i1 = 0; i1 < keys.length; i1++) {
      const it1 = keys[i1];
      if (tft[i1]) {
        const idx = idxs[i1];
        this.data.get(it1)[idx].cy2 = cy2;
      }
    }
  }
  private getMaxCy(keys: string[], tft: boolean[], idxs: number[]) {
    const cys = keys.map((a1, i1) => {
      if (tft[i1] === true) {
        const r2 = this.data.get(a1);
        return r2[idxs[i1]].cy;
      } else {
        return undefined;
      }
    }).filter(a1 => a1 !== undefined);
    // console.log(cys);
    return Math.max(...cys);
  }
  private getTrueFalseTrue(r1: DAddress[], min: DAddress) {
    return r1.map(a1 => a1 !== undefined && isTheSameAddress(a1, min));
  }
  private getMinAddr(addrs: DAddress[]) {
    let m: DAddress;
    for (const it of addrs) {
      if (it !== undefined) {
        if (m === undefined) {
          m = it;
        } else {
          m = isLessThenAddress(it, m) ? it : m;
        }
      }
    }
    return m;
  }
  private get000toAddrAddrAddr(idxs: number[], keys: string[]): DAddress[] {
    const r1 = [];
    for (let i1 = 0; i1 < idxs.length; i1++) {
      const it1 = idxs[i1];
      const r2 = this.data.get(keys[i1]);
      if (it1 >= r2.length) {
        r1.push(undefined);
      } else {
        r1.push(r2[it1].addresses.verses[0]);
      }
    }
    return r1;
  }
}
