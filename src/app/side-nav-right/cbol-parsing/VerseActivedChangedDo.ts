import { FunctionIsOpened } from './../FunctionIsOpened';
import { EventVerseChanged } from './EventVerseChanged';
import { DAddress } from 'src/app/bible-address/DAddress';
import { FunctionSelectionTab } from '../FunctionSelectionTab';
/**
 * 3個寫在 OnInit 都一樣，不重構不舒服。
 * 它包含 selected節 改變時 and 右邊視窗被開啟或關閉時 and 功能視窗切換時 3個事件
 * @param tabString 
 * @param fn 
 */
export function VerseActivedChangedDo(tabString: '分析' | '註釋' | '串珠' | '樹狀圖', fn: (addr: DAddress) => void) {
  new FunctionDoWhenVerseChanged().main(tabString, fn);
}

export class FunctionDoWhenVerseChanged {
  private tabString: string;
  private fn: (addr: DAddress) => void;
  main(tabString: string, fn: (addr: DAddress) => void) {
    this.tabString = tabString;
    this.fn = fn;

    EventVerseChanged.s.changed$.subscribe(data => {
      // console.log('verse chagned.' + JSON.stringify(data) )
      this.checkAndDo();
    });
    FunctionIsOpened.s.changed$.subscribe(isO => {
      // console.log('is opened.' + isO)
      this.checkAndDo();
    });
    FunctionSelectionTab.s.changed$.subscribe(tab => {
      console.log('selection chagned.'+ tab)
      this.checkAndDo();
    });

  }
  checkAndDo() {
    if (FunctionIsOpened.s.getValue() && this.tabString === FunctionSelectionTab.s.getValue()) {
      // 處理
      setTimeout(() => {
        const data = EventVerseChanged.s.getValue();
        // console.log(data)
        this.fn(data);        
      }, 0);
    }
  }
}
