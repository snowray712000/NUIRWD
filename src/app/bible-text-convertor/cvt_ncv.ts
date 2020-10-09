import { DOneLine } from 'src/app/bible-text-convertor/AddBase';
import { VerseRange } from '../bible-address/VerseRange';
import { AddMergeVerse } from '../version-parellel/one-ver/AddMergeVerse';
import { AddParenthesesUnvNcv } from '../version-parellel/one-ver/AddParenthesesUnv';
import { AddMapPhotoInfo } from '../version-parellel/one-ver/AddMapPhotoInfo';
import { AddTitleH3 } from '../version-parellel/one-ver/AddTitleHx';
import { AddReferenceCnv } from '../version-parellel/one-ver/AddReferenceCnv';
import { AddBrCnv } from '../version-parellel/one-ver/AddBrCnv';
/** 新譯本 */

export function cvt_ncv(re1: DOneLine[], verses: VerseRange) {
  re1 = new AddMergeVerse().main(re1, verses);
  re1 = new AddTitleH3().main(re1, verses);
  re1 = new AddParenthesesUnvNcv().main(re1, verses);
  re1 = new AddReferenceCnv().main(re1, verses);
  re1 = new AddMapPhotoInfo(this.dataMapAndPhoto).main(re1, verses);
  re1 = new AddBrCnv().main(re1, verses);
  return re1;
}

