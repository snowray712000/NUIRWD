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
  /** 和合本 小括號(全型 FullWidth), 用在注解(或譯....), 或是標題時(大衛的詩) */
  isParenthesesFW?: 1;
  /** 和合本 小括號(半型 HalfWidth), cbol時 */
  isParenthesesHW?: 1;

  /** 和合本 小括號(全型), 連續2層括號, 內層 新譯本 詩3:1 */
  isParenthesesFW2?: 1;
  /** sobj 的資料, 地圖與相片 */
  sobj?: any;
  isMap?: boolean;
  isPhoto?: boolean;
  /** 新譯本是 h3 */
  isTitle1?: 1;
  /** 交互參照 */
  isRef?: 1;
  /** 交互參照內容 */
  refDescription?: string;
  /** 換行, 新譯本 h3 與 非h3 交接觸 */
  isBr?: 1;
}


export interface DOneLine {
  addresses?: VerseRange;
  children?: DText[];
}
