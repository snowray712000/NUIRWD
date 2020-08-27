import { VerseRange } from 'src/app/bible-address/VerseRange';

export interface IAddBase {
  main(lines: DOneLine[], verses: VerseRange): DOneLine[];
}

/** w,sn,tp,tp2 */
export interface DText {
  w?: string;
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
  /** hr/, 原文字典，不同本用這個隔開. */
  isHr?: 1;
  /** 搜尋時，找到的keyword，例如「摩西」 */
  key?: string;
  /** 搜尋時，找到的keyword，例如「摩西 亞倫」, 摩西, 0, 這可能是上色要用到 */
  keyIdx0based?: number;
  listTp?: 'ol' | 'ul';
  /** 1是第一層, 0就是純文字了 */
  listLevel?: number;
  /** 當時分析的層數 */
  listIdx?: number[];
  /** 若出現這個, html 就要加 <li> */
  isListStart?: 1 | 0;
  /** 若出現這個, html 就要加 </li> */
  isListEnd?: 1 | 0;
  /** 若出現這個, html 就要加 </ol> 或 </ul> */
  isOrderStart?: 1 | 0;
  /** 若出現這個, html 就要加 </ol> 或 </ul> */
  isOrderEnd?: 1 | 0;

  /** idxOrder, 有這個 html 繪圖可以更加漂亮, 交錯深度之類的 */
  idxOrder?: number;

  /** twcb orig dict 出現的, 它原本就是 html 格式, 若巢狀, 愈前面的 class 愈裡層 */
  class?: string;
}


export interface DOneLine {
  addresses?: VerseRange;
  children?: DText[];
}
