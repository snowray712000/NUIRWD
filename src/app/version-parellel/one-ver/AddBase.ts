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
  /** 此節是 'a', 且無法與上節合併時, 會顯示 '併入上節' 並且加上 isMerge=1, 若已與上節合併, 會修正上節的 verses, 並將此節 remove 掉 */
  isMerge?: 1;
}

export interface DOneLine {
  addresses?: VerseRange;
  children?: DText[];
}
