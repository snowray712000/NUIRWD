/** 建 info dialog 時, 需傳入的參數 */
export interface DInfoDialogData {
  desc?: string;
  sn?: string;
  isOld?: boolean;
  /** 使用者選用的版本, 中文/英文/浸宣 */
  checkStates: {
    isChinese: boolean;
    isEng: boolean;
    isSbdag: boolean;
  };
}
