import { VerseRange } from 'src/app/bible-address/VerseRange';
import { BookChapDistinctTool } from './BookChapDistinctTool';
import { ApiSobj, DApiSobOneRecord } from 'src/app/fhl-api/ApiSobj';
import { distinct_linq } from 'src/app/linq-like/distinct';
import { firstOrDefault } from 'src/app/linq-like/FirstOrDefault';
import { SplitStringByRegexVer2 } from 'src/app/tools/SplitStringByRegex';
import { DOneLine } from './AddBase';
export class AddMapPhotoInfo {
  /** 若這經文範例 verses 中沒有任何 sobj 資料, 回傳 re2 */
  async mainAsync(re2: DOneLine[], verses: VerseRange): Promise<DOneLine[]> {
    const re3 = await this.getPhotoMapFromApi(verses);
    // console.log(re3);
    if (re3[0].record.length === 0) {
      return re2;
    }
    const map1 = new Map<number, DApiSobOneRecord>();
    for (const it1 of re3) {
      for (const it2 of it1.record) {
        const id = parseInt(it2.id, 10);
        if (map1.has(id) === false) {
          map1.set(id, it2);
        }
      }
    }
    // console.log(map1);
    let naAll: string[] = [];
    let regAll: RegExp;
    const map2 = new Map<RegExp, number>();
    for (const ky of map1.keys()) {
      const it1 = map1.get(ky);
      const na: string[] = [];
      na.push(it1.cname);
      na.push(it1.c1name);
      na.push(it1.c2name);
      na.push(it1.mname);
      na.push(it1.ename);
      const na2 = distinct_linq(na).filter(a1 => a1 !== undefined && a1.length !== 0).sort(a1 => -a1.length);
      // console.log(na2);
      na2.forEach(a1 => naAll.push(a1));
      if (na2.length > 0) {
        const naOr = na2.join('|');
        // /(?:Green|希利尼|希臘)/ig
        const regStr = `${naOr}`;
        const reg = new RegExp(regStr, 'ig');
        map2.set(reg, ky);
      }
    }
    naAll = distinct_linq(naAll).filter(a1 => a1 !== undefined && a1.length !== 0).sort(a1 => -a1.length);
    if (naAll.length > 0) {
      // console.log(naAll);
      regAll = new RegExp(`(?:${naAll.join('|')})`, 'ig');
      // console.log(regAll);
    }
    const re4EachLine: DOneLine[] = [];
    const keys2 = Array.from(map2.keys());
    for (const it of re2) {
      const reThisLine = [];
      for (const it2 of it.children) {
        if (it2.sn !== undefined) {
          reThisLine.push(it2);
          continue;
        }
        const r1 = regAll.exec(it2.w);
        if (r1 == null) {
          reThisLine.push(it2);
          continue;
        }
        const r2 = firstOrDefault(keys2, a1 => a1.exec(it2.w) !== null);
        r2.lastIndex = -1; // 要設定回-1, 因為是 global, 不然下次找到同個,就會找不到了
        const r4 = new SplitStringByRegexVer2().main(it2.w, r2);
        const idObj = map2.get(r2);
        const obj = map1.get(idObj);
        for (const it3 of r4) {
          if (it3.exec === undefined) {
            reThisLine.push(it3);
            continue;
          }
          const isSite = obj.is_site === '1';
          const isPhoto = obj.has_collect === '1';
          // 型成 3個 (或2個)
          reThisLine.push({ w: it3.w, sobj: obj });
          if (isSite) {
            reThisLine.push({ w: '', sobj: obj, isMap: true });
          }
          if (isPhoto) {
            reThisLine.push({ w: '', sobj: obj, isPhoto: true });
          }
        }
      }
      re4EachLine.push({
        addresses: it.addresses,
        children: reThisLine
      });
    }
    // console.log(re4EachLine);
    return re4EachLine;
  }
  private async getPhotoMapFromApi(verses: VerseRange) {
    const r1 = new BookChapDistinctTool(verses);
    const r2 = r1.addressesOfBookChap.map(a1 => {
      a1.verse = -1;
      return new ApiSobj().querySobjAsync({ address: a1 }).toPromise();
    });
    const re3 = await Promise.all(r2);
    return re3;
  }
}
