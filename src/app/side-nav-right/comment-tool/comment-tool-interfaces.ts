import { DAddress } from 'src/app/bible-address/DAddress';

export interface ICommentToolDataGetter {
  mainAsync(address: DAddress): Promise<DCommentDataQueryResult[]>;
}

export interface DCommentDataQueryResult {
  /** 原始文字 */
  w: string;
  /** level,在樣式上可應用 */
  level: number;
  /** 非必要,方便RD用 */
  idx: number;
  cnt0?: number;
  iReg?: number;
  parent?: DCommentDataQueryResult;
  children?: DCommentDataQueryResult[];
}
