export class DictSourceVersionsTools {
  getDictSourceVersions(checkedStates: {
    isChinese: boolean;
    isEng: boolean;
    isSbdag: boolean;
  }, isOldStatement: boolean) {
    const vers: string[] = [];
    if (checkedStates.isChinese) {
      vers.push('中文');
    }
    // 按 cbol 順序, 中文->浸宣->英文
    if (checkedStates.isSbdag) {
      vers.push('浸宣');
    }
    if (checkedStates.isEng) {
      vers.push('英文');
    }
    if (vers.length === 0) {
      vers.push('中文');
    }
    return vers;
  }
}
