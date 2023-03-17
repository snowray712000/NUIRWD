import { DText } from "src/app/bible-text-convertor/DText";

export function newLineNewLineMerge(datas: DText[][]): DText[] {
  const ree = [];
  for (const it1 of datas) {
    for (const it2 of it1) {
      ree.push(it2);
    }
    ree.push({ isBr: 1 });
    ree.push({ isBr: 1 });
  }
  return ree;
}
