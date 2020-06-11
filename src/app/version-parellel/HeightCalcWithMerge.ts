import { DOneLineHeight } from './one-ver/one-ver.component';
import { linq_max } from '../linq-like/linq_max';
import { linq_last } from '../linq-like/linq_last';
import { DAddress, isGreaterThenAddress } from '../bible-address/DAddress';
import { linq_range } from '../linq-like/linq_range';
import { linq_sum } from '../linq-like/linq_sum';
/** HeightCalc 呼叫 */
export class HeightCalcWithMerge {
  private data: Map<string, DOneLineHeight[]>;
  main(data: Map<string, DOneLineHeight[]>) {
    this.data = data;
    const { keys, lines } = this.getKeyAndValues();
    const idxsA = [0, 0, 0];
    while (true) {
      // console.log('oneloop');
      // console.log(idxsA);
      const addrs = this.getAddrAddrAddr(idxsA, lines);
      if (addrs.every(a1 => a1 === undefined)) {
        break;
      }
      // console.log(addrs);
      const addrMax = this.getMaxAddrs(addrs);
      // console.log(addrMax);
      const idxsB = this.getIdxIncludeMaxAddrOrLast(addrMax, idxsA, lines);
      // console.log(idxsB);
      this.setCy2EqualCy(lines, idxsA, idxsB);
      // console.log(this.data);
      const cycycy = this.getCyCyCy(lines, idxsA, idxsB);
      // console.log(cycycy);
      const maxCy = linq_max(cycycy.filter(a1 => a1 !== undefined));
      // console.log(maxCy);
      const plusCyCyCy = cycycy.map(a1 => a1 !== undefined ? maxCy - a1 : undefined);
      // console.log(plusCyCyCy);
      this.setCy2WithPlusCy(lines, idxsB, plusCyCyCy);
      for (let i = 0; i < lines.length; i++) {
        const b = idxsB[i];
        if (b !== undefined) {
          idxsA[i] = b + 1;
        }
      }
    }
  }
  private setCy2WithPlusCy(lines: DOneLineHeight[][], idxsB: any[], plusCyCyCy: number[]) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const b = idxsB[i];
      if (b !== undefined) {
        const r1 = line[b];
        r1.cy2 = r1.cy + plusCyCyCy[i];
      }
      // console.log(line);
    }
  }
  private getCyCyCy(lines: DOneLineHeight[][], idxsA: number[], idxsB: any[]) {
    const re = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const a = idxsA[i];
      const b = idxsB[i];
      if (b === undefined) {
        re.push(undefined);
      } else {
        re.push(linq_sum(linq_range(a, b - a + 1), a1 => line[a1].cy));
      }
    }
    return re;
  }
  private setCy2EqualCy(lines: DOneLineHeight[][], idxsA: number[], idxsB: number[]) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const a = idxsA[i];
      const b = idxsB[i];
      if (b === undefined) {
        // 這個版本,已經沒有任何資料要處理
      } else {
        for (let i2 = a; i2 < b; i2++) {
          const r1 = line[i2];
          r1.cy2 = r1.cy;
        }
      }
    }
  }
  private getIdxIncludeMaxAddrOrLast(addrMax, idxsA, lines: DOneLineHeight[][]) {
    const idxsB = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let idx = idxsA[i];
      if (idx >= line.length) {
        idxsB.push(undefined);
      } else {
        while (true) {
          if (line[idx].addresses.isIn(addrMax)) {
            idxsB.push(idx);
            break;
          } else {
            if (idx + 1 >= line.length) {
              idxsB.push(idx);
              break;
            } else {
              // 不一定, idx 要加, 還要看下一個是不是小於等於這個
              const addr = linq_last(line[idx + 1].addresses.verses);
              if (false === isGreaterThenAddress(addr, addrMax)) {
                idx++;
              } else {
                idxsB.push(idx);
                break;
              }
            }
          }
        }
      }
    }
    return idxsB;
  }
  private getMaxAddrs(addrs: DAddress[]) {
    let m: DAddress;
    for (const it1 of addrs) {
      if (it1 !== undefined) {
        if (m === undefined) {
          m = it1;
        } else {
          m = isGreaterThenAddress(it1, m) ? it1 : m;
        }
      }
    }
    return m;
  }
  private getAddrAddrAddr(idxsA: number[], lines: DOneLineHeight[][]) {
    const re = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const r1 = idxsA[i];
      if (r1 >= line.length) {
        re.push(undefined);
      } else {
        re.push(linq_last(line[r1].addresses.verses));
      }
    }
    return re;
  }
  private getKeyAndValues() {
    const keys: string[] = [];
    const lines: DOneLineHeight[][] = [];
    for (const it1 of this.data) {
      keys.push(it1[0]);
      lines.push(it1[1]);
    }
    return { keys, lines };
  }
}
