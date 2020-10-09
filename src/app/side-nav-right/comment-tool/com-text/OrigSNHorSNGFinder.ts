import { SplitStringByRegex } from 'src/app/tools/SplitStringByRegex';
/** SNG04314 SNH04314 */
export class OrigSNHorSNGFinder {
  main(str: string) {
    const reg1 = /SN(?:G|H)\d+/gi;
    const r1 = new SplitStringByRegex().main(str, reg1);
    const re2 = [];
    const reg2 = /SN(G|H)(\d+)/i;
    for (const it1 of r1.data) {
      const r2 = reg2.exec(it1);
      if (r2 === null) {
        re2.push({ w: it1 });
      } else {
        const sn = parseInt(r2[2], 10);
        const GorH = r2[1].toUpperCase();
        const isOld = GorH === 'H';
        re2.push({ sn, isOld, w: it1 });
      }
    }
    return re2;
  }
}
export interface DOrigFinderResult {
  w: string;
  sn?: string;
  isOld?: boolean;
}
