import { VerseRange } from 'src/app/bible-address/VerseRange';

export interface IAddBase {
  /** 有的需要 async, 如 sobj, 有的需 verses, 如 sobj */
  mainAsync(lines: DOneLine[], verses: VerseRange): Promise<DOneLine[]>;
}

/** w,sn,tp,tp2 */
export interface DText {
  w: string;
  sn?: string;
  /** H, Hebrew G, Greek */
  tp?: 'H' | 'G';
  /** T, time */
  tp2?: 'WG' | 'WTG' | 'WAG' | 'WTH' | 'WH';
  /** 花括號 */
  isCurly?: 1 | 0;
}

export interface DOneLine {
  addresses?: VerseRange;
  children?: DText[];
}
