import { DApiSdResult } from './DApiSdResult';
import { queryOrigCore } from './queryOrigCore';
/** CBOL 版本的 原文字典 */
export class ApiSd {
  queryOrigAsync(arg: {
    sn: string;
    isOldTestment?: boolean;
  }): Promise<DApiSdResult> {
    return queryOrigCore('sd.php', arg);
  }
}

