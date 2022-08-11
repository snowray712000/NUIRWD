import { Observable, Subscriber } from 'rxjs';
import { RouteStartedWhenFrame } from 'src/app/rwd-frameset/RouteStartedWhenFrame';
import { DAddress } from 'src/app/bible-address/DAddress';
import { LocalStorageJsonBase } from 'src/app/tools/LocalStorageJsonBase';
/**
 * 主要用在， click某節時，右邊的功能視窗要進行查詢資料
 * 也用在， 將 目前 selected 節，上色成 selected ( dlines-rendor.comp )
 */
export class EventVerseChanged extends LocalStorageJsonBase<DAddress>{
  static s = new EventVerseChanged();
  _getKey(): string {
    return 'EventVerseChanged';
  }
  override _getDefaultValue() { return { book: 45, chap: 1, verse: 1 }; }
}
