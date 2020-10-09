import { DOneLine } from 'src/app/bible-text-convertor/AddBase';
import { VerseRange } from '../bible-address/VerseRange';
import { AddParenthesesUnvNcv } from '../version-parellel/one-ver/AddParenthesesUnv';
import { AddBrStdandard } from '../version-parellel/one-ver/AddBrStdandard';
/** 原文直譯 */
export function cvt_cbol(re1: DOneLine[], verses: VerseRange) {
  re1 = new AddBrStdandard().main(re1, verses);
  re1 = new AddParenthesesUnvNcv().main(re1, verses);
  return re1;
}
