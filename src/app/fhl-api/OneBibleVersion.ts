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
