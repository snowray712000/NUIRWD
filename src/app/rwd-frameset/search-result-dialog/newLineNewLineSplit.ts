import * as LQ from 'linq';
import { DText } from 'src/app/bible-text-convertor/AddBase';
export function newLineNewLineSplit(dataRef: DText[]): DText[][] {
  const re: DText[][] = [];
  const dataClone = [...dataRef];

  while (true) {
    const r1 = LQ.from(dataClone).takeWhile(a1 => a1.isBr === 1).toArray();
    if (r1.length !== 0) { dataClone.splice(0, r1.length); }

    const r2 = LQ.from(dataClone).takeWhile((a1, i1) => {
      // this and next next is br
      const rr2 = dataClone[i1 + 1];

      if (a1 === undefined || rr2 === undefined) {
        return true;
      }
      if (a1.isBr !== 1 || rr2.isBr !== 1) {
        return true;
      }
      return false;
    }).toArray();

    if (r2.length !== 0) {
      dataClone.splice(0, r2.length);
      re.push(r2);
    } else {
      break;
    }
  }
  return re;
}

