import { DOneLine } from './AddBase';
import { VerseRange } from '../bible-address/VerseRange';
import * as LQ from "linq";
import { AddMergeVerse } from '../version-parellel/one-ver/AddMergeVerse';
import { AddParenthesesUnvNcv } from '../version-parellel/one-ver/AddParenthesesUnv';
import { AddSnInfo } from '../version-parellel/one-ver/AddSnInfo';
import { AddMapPhotoInfo } from '../version-parellel/one-ver/AddMapPhotoInfo';
import { cvt_unv } from './unv';
/**
 * KJV ASV
 * @param data
 * @param settings sn,例如 081 而不是 H081
 */
export function cvt_kjv(data: DOneLine[], settings: { verses: VerseRange, isMapPhotoInfo?: 0 | 1, isSnExist?: 1 | 0, sn?: string }) {
  return cvt_unv(data, settings);
}
