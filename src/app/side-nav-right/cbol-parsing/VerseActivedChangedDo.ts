import { FunctionIsOpened } from './../FunctionIsOpened';
import { EventVerseChanged } from './EventVerseChanged';
import { DAddress } from 'src/app/bible-address/DAddress';
import { FunctionSelectionTab } from '../FunctionSelectionTab';
/** 3個寫在 OnInit 都一樣，不重構不舒服。 */

export function VerseActivedChangedDo(tabString: '分析' | '註釋' | '串珠', fn: (addr: DAddress) => void) {
  new FunctionDoWhenVerseChanged().main(tabString, fn);
}

export class FunctionDoWhenVerseChanged {
  private tabString: string;
  private fn: (addr: DAddress) => void;
  main(tabString: string, fn: (addr: DAddress) => void) {
    this.tabString = tabString;
    this.fn = fn;

    EventVerseChanged.s.changed$.subscribe(data => {
      this.checkAndDo();
    });
    FunctionIsOpened.s.changed$.subscribe(isO => {
      this.checkAndDo();
    });
    FunctionSelectionTab.s.changed$.subscribe(tab => {
      this.checkAndDo();
    });

  }
  checkAndDo() {
    if (FunctionIsOpened.s.getValue() &&
      this.tabString === FunctionSelectionTab.s.getValue()) {
      // 處理
      const data = EventVerseChanged.s.getValue();
      this.fn(data);
    }
  }
}
