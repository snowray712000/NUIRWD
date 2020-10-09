import { DAbvRecord } from './DAbvResult';

/** 舊版用的資料結構, 新開發請用 DAbvRecord */
export class OneBibleVersion {
  public id = -1;
  public na = ''; // unv, kjv, bhs
  public naChinese = '';
  public idFont = 0; // 特殊字型 0:不需要 1:希臘文 2:希伯來文 3:羅馬拼音
  public isExistNewTestment = true;
  public isExistOldTestment = true;
  public isExistStrongNumber = false;
  public isAllowDownload = false;
  public tLastModifiedTime: Date;
}
/** 為了相容舊版使用方法，請直接使用 DAbvRecord, 但舊版的 id 要自己設, 此函式不轉 */
export function cvtToOneBibleVersion(a1: DAbvRecord): OneBibleVersion {
  const re = new OneBibleVersion();
  re.na = a1.book;
  re.naChinese = a1.cname;
  re.idFont = a1.proc;
  re.isAllowDownload = a1.candownload === 1;
  re.isExistNewTestment = a1.otonly !== 1;
  re.isExistOldTestment = a1.ntonly !== 1;
  re.isExistStrongNumber = a1.strong === 1;
  if (a1.version !== undefined) {
    re.tLastModifiedTime = new Date(a1.version);
  }
  return re;
}
