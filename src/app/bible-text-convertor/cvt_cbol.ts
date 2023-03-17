import { DOneLine } from "src/app/bible-text-convertor/DOneLine";
import { VerseRange } from '../bible-address/VerseRange';
import { AddParenthesesUnvNcv } from '../version-parellel/one-ver/AddParenthesesUnv';
import { AddBrStdandard } from '../version-parellel/one-ver/AddBrStdandard';
import { SplitStringByRegexVer2 } from '../tools/SplitStringByRegex';
import { AddSnInfo } from '../version-parellel/one-ver/AddSnInfo';
import Enumerable from 'linq';
import { AddReferenceCnv } from '../version-parellel/one-ver/AddReferenceCnv';
import { AddReferenceFromOrigDictText } from '../version-parellel/one-ver/AddReferenceFromOrigDictText';
/** 原文直譯 */
export function cvt_cbol(re1: DOneLine[], verses: VerseRange) {
  re1 = new AddBrStdandard().main(re1, verses);
  re1 = new AddParenthesesUnvNcv().main(re1, verses);
  return re1;
}

