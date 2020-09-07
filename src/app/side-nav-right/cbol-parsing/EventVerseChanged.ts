import { Observable, Subscriber } from 'rxjs';
import { RouteStartedWhenFrame } from 'src/app/rwd-frameset/RouteStartedWhenFrame';
import { DAddress } from 'src/app/bible-address/DAddress';
import { LocalStorageJsonBase } from 'src/app/tools/LocalStorageJsonBase';

export class EventVerseChanged extends LocalStorageJsonBase<DAddress>{
  static s = new EventVerseChanged();
  _getKey(): string {
    return 'EventVerseChanged';
  }
  _getDefaultValue() { return { book: 45, chap: 1, verse: 1 }; }
}
