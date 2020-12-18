import { LocalStorageArrayBase } from '../../tools/LocalStorageArrayBase';
import * as LQ from 'linq';

export class HistorysLink extends LocalStorageArrayBase<string> {
  static s = new HistorysLink();
  _getKey(): string { return "historyslink"; }
  _getDefaultValue(): string[] { return ['創1']; }

  push_front(addr: string) {
    let r1 = this.curValue;
    r1.unshift(addr);
    let r2 = LQ.from(r1).distinct().toArray();
    if ( r2.length > 30 ) { r2.splice(30,1);}
    this.updateValueAndSaveToStorageAndTriggerEvent(r2);
  }
}
