import { DAddress, DAddressComparor } from 'src/app/bible-address/DAddress';
import * as LQ from 'linq';
import { UT } from './UT';
export async function test_DAddressComparor() {
  const equal = UT.equal;

  return UT.gFnSafe(fns => {
    test01a(); // 1,2 合為 1-2
    test01b();
    return;
    function test01a() {
      const datas: DAddress[] = [
        { book: 40, chap: 1, verse: 1 },
        { book: 40, chap: 1, verse: 1 },
        { book: 40, chap: 1, verse: 2 },
        { book: 40, chap: 1, verse: 1 },
        { book: 40, chap: 2, verse: 1 },
        { book: 41, chap: 1, verse: 1 },
      ];
      const dst = LQ.from(datas).distinct(DAddressComparor).toArray();
      const dstExcept: DAddress[] = [
        { book: 40, chap: 1, verse: 1 },
        { book: 40, chap: 1, verse: 2 },
        { book: 40, chap: 2, verse: 1 },
        { book: 41, chap: 1, verse: 1 },
      ];
      fns.push(equal('01a_需要工具 distinct address', dstExcept, dst));
    }
    function test01b() {
      const datas: DAddress[] = [
        { book: 41, chap: 1, verse: 1 },
        { book: 40, chap: 1, verse: 1 },
        { book: 40, chap: 2, verse: 1 },
        { book: 40, chap: 1, verse: 2 },
      ];
      const dst = LQ.from(datas).orderBy(DAddressComparor).toArray();
      const dstExcept: DAddress[] = [
        { book: 40, chap: 1, verse: 1 },
        { book: 40, chap: 1, verse: 2 },
        { book: 40, chap: 2, verse: 1 },
        { book: 41, chap: 1, verse: 1 },
      ];
      fns.push(equal('01b_工具 order address', dstExcept, dst));
    }
  });
}
