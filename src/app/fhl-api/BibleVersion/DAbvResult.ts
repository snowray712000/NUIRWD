export interface DAbvResult {
  parsing: Date;
  comment: Date;
  record_count: number;
  record: DAbvRecord[];
}

export interface DAbvRecord {
  /** unv */
  book: string;
  candownload: 1|0;
  /** 和合本 */
  cname: string;
  ntonly: 1|0;
  otonly: 1|0;
  /** 紅皮聖經全羅 3 舊約馬索拉原文是 2 新約原文是 1 一般是 0 */
  proc: 0|1|2;
  strong: 0|1;
  /** 2012-09-06 05:50:01 或 空字串 */
  version?: string;

}
