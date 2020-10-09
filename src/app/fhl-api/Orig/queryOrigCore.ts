import { ajax } from 'rxjs/ajax';
import { FhlUrl } from '../FhlUrl';
import { map } from 'rxjs/operators';
import { DApiSdResult } from './DApiSdResult';
import { DisplayLangSetting } from 'src/app/rwd-frameset/dialog-display-setting/DisplayLangSetting';
/**
 * 因為開發 ApiSd 與 ApiStwcb ApiSbdag 都很多一樣，就抽出來重構。
 * CBOL 原文字典；stwcbhdic 浸宣舊約 sbdag 浸宣新約
 */
export function queryOrigCore(api: 'sd.php' | 'stwcbhdic.php' | 'sbdag.php', arg: {
  sn: string;
  isOldTestment?: boolean;
}): Promise<DApiSdResult> {
  const gb = DisplayLangSetting.s.getFromLocalStorageIsGB() ? 1 : 0;
  const N = arg.isOldTestment ? '1' : '0';
  return ajax({ url: `${new FhlUrl().getJsonUrl2()}${api}?N=${N}&k=${arg.sn}&gb=${gb}` })
    .pipe(map(a1 => a1.response as DApiSdResult)).toPromise();
}
