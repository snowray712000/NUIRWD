import { VerseRange } from 'src/app/bible-address/VerseRange';
import { merge_nestarray } from 'src/app/tools/merge_nestarray';
import { DAddressComparor, isTheSameAddress } from 'src/app/bible-address/DAddress';
import { DOneLine } from 'src/app/bible-text-convertor/AddBase';
import Enumerable from 'linq';
/** 藉unit test開發. */

export function mergeDifferentVersionResult(datas: DOneLine[][], verses: VerseRange): DOneLine[] {
  if (datas.length === 1) {
    return datas[0];
  }
  const datas2 = merge_nestarray(datas);
  const datas2a = Enumerable.from(datas2).where(a1 => a1.addresses !== undefined).toArray();
  const datas2b = Enumerable.from(datas2).where(a1 => a1.addresses === undefined).toArray();

  const versionOrder = getVersionOrder();
  const addrDistinct = verses.verses;

  const datas3b = doEachVerseAndJoin();
  if (datas2b.length === 0) {
    return datas3b;
  } else {
    return datas3b.concat(datas2b);
  }

  function getVersionOrder() {
    return Enumerable.from(datas).select(a1 => a1[0].ver).toArray();
  }
  function doEachVerseAndJoin() {
    const datas3a = Enumerable.from(addrDistinct).select(a1 => {
      const re1 = Enumerable.from(datas2a)
        .select((aa1, ii1) => ({ idx: ii1, da: aa1 }))
        .where(aa1 => isTheSameAddress(aa1.da.addresses.verses[0], a1))
        .toArray();

      // re1 很多的符合, 接著按版本順序呈現
      const re2 = Enumerable.from(versionOrder)
        .select(aa1 => Enumerable.from(re1)
          .firstOrDefault(aaa1 => aaa1.da.ver === aa1))
        .where(aa1 => aa1 !== undefined)
        .select(aa1 => aa1.da).toArray();

      // 移除掉, 下個 loop 會更快
      Enumerable.from(re1).select(aa1 => aa1.idx).reverse()
        .forEach(aa1 => datas2a.splice(aa1, 1));

      return re2;
    }).toArray();
    return merge_nestarray(datas3a);
  }

}
