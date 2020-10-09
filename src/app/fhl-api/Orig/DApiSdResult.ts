export interface DApiSdResult {
  /** 就是只會有 record[0] */
  record: DApiSdRecord[];
  status: string | 'success';
}
export interface DApiSdRecord {
  /** 浸宣版 or 中文版 */
  dic_text: string;
  /** 中文版與英文版, 是一起取得 */
  edic_text?: string;
  /** 11, 會寫 '00011' */
  sn: string;
  orig: string;
}
