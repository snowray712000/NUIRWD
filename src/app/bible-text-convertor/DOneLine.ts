import { VerseRange } from 'src/app/bible-address/VerseRange';
import { DText } from './DText';

/**
 * 一行，表示，一節經文
 * 一節經文，是由很多dtexts組成
 * 一行，可能是多節經文合併。例如有些「合併上節」
 * 一行，也可能是，創1:2-3;出2:3-4; 之類的
 * 還需要版本資訊才更完整
 */

export interface DOneLine {
  addresses?: VerseRange;
  children?: DText[];
  ver?: string;
}
