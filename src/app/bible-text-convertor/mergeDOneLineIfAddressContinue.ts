import { deepCopy } from 'src/app/tools/deepCopy';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { DOneLine, DText } from 'src/app/bible-text-convertor/AddBase';
import * as LQ from 'linq';
import { getNextAddress, isTheSameAddress } from '../bible-address/DAddress';
export function mergeDOneLineIfAddressContinue(datas: DOneLine[]): DOneLine[] {
  if (datas === undefined || datas.length === 0) {
    return [];
  } else if (datas.length === 1) {
    return datas;
  }

  const re1 = groupContinue();
  const re2 = LQ.from(re1).select(mergeTo).toArray();

  return re2;
  function isContinue(pre: VerseRange, cur: VerseRange) {
    if (pre === undefined || cur === undefined ||
      pre.verses.length === 0 || cur.verses.length === 0) {
      return false;
    }

    const rr1 = LQ.from(pre.verses).lastOrDefault();
    const rr2 = LQ.from(cur.verses).firstOrDefault();
    return isTheSameAddress(getNextAddress(rr1), rr2);
  }
  function groupContinue(): number[][] {
    // 分段
    const re = [];
    if (datas.length !== 0) {
      let group = [];
      group.push(0);
      LQ.range(1, datas.length - 1).forEach(i => {

        const pre = datas[i - 1];
        const cur = datas[i];
        if (isTheSameVersion(pre.ver, cur.ver) && isContinue(pre.addresses, cur.addresses)) {
          group.push(i);
        } else {
          re.push(group);
          group = [i];
        }
      });
      if (group.length !== 0) {
        re.push(group);
      }
    }
    return re;
    function isTheSameVersion(pre?: string, cur?: string) {
      if (pre === undefined && cur === undefined) { return true; }
      if (pre === undefined && cur !== undefined) { return false; }
      if (pre !== undefined && cur === undefined) { return false; }
      return pre === cur;
    }
  }
  function mergeTo(idxs: number[]) {
    const rfirst = datas[idxs[0]];
    if (idxs.length === 1) {
      return rfirst;
    }


    const dtexts: DText[] = [];
    const addrs = new VerseRange();

    LQ.from(idxs).forEach(i => {
      const rr1 = datas[i];
      for (const it of rr1.children) {
        dtexts.push(deepCopy(it));
      }
      for (const it of rr1.addresses.verses) {
        addrs.verses.push(deepCopy(it));
      }
    });

    const re: DOneLine = {
      children: dtexts,
      addresses: addrs,
    };
    if (rfirst.ver !== undefined) {
      re.ver = rfirst.ver;
    }

    return re;
  }
}
