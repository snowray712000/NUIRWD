import { DAddress } from 'src/app/bible-address/DAddress';
import { ReferenceFinder } from './ReferenceFinder';
import { FixDesDefaultBookChap } from './FixDesDefaultBookChap';
import { OrigSNHorSNGFinder } from './OrigSNHorSNGFinder';
import { DCommonetDataShow } from './DCommonetDataShow';
export class ReferenceAndOrigFinderUsingAtCommentTool {
  main(textOneLine: string, address: DAddress): DCommonetDataShow[] {
    const fixer = new FixDesDefaultBookChap(address);
    const re = new ReferenceFinder({ fixDescriptor: fixer }).main(textOneLine);
    const re2: DCommonetDataShow[] = [];
    for (const it1 of re) {
      if (it1.des !== undefined) {
        re2.push(it1);
      } else {
        const r2 = new OrigSNHorSNGFinder().main(it1.w);
        for (const it2 of r2) {
          re2.push(it2);
        }
      }
    }
    return re2;
  }
}

