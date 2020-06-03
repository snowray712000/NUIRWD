import { Observable } from 'rxjs';

export interface IOrigDictQuery {
  /** ver: 中文、英文、浸宣 */
  queryDictAsync(arg: { sn: string, isOldTestment?: boolean, isSimpleChinese?: boolean, ver?: string }): Observable<DOrigDict>;
}
/** 因 dbol-dict 而有, 但 info-dialog 也會用 */
export interface DOrigDict {
  sn: string;
  orig: string;
  text: string;
  /** 中文、英文、浸宣 */
  ver: string;
}
