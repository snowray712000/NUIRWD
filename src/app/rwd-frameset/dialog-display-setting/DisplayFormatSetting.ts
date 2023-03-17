import Enumerable from 'linq';
import { DAddress } from 'src/app/bible-address/DAddress';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { GetLinesFromQbResultOldTestment } from 'src/app/side-nav-right/cbol-parsing/GetLinesFromQbResultOldTestment';
import { LocalStorageStringBase } from 'src/app/tools/LocalStorageStringBase';
import { DisplayLangSetting } from './DisplayLangSetting';
/** 用 static .s '創1:1' '1:1' '1' 'v1' '' */

export type TpDisplayFormatSetting = "創1:1" | "1:1" | "1" | "創1v1" | "1v1" | "v1" | "none" | "创1:1" | "创1v1"
export class DisplayFormatSetting extends LocalStorageStringBase {
  static s = new DisplayFormatSetting();
  _getKey() { return 'displayformat'; }
  override _getDefaultValue() { return '創1:1'; }
  override getValue(): TpDisplayFormatSetting {
    return super.getValue() as TpDisplayFormatSetting
  }

  /**
   * 併排排版顯示主頁面經文用，依設定
   * (暫時無用，因為被 verserange 取代了，可15章)
   * @param addr 
   */
  getDisplayOfAddr(addr: DAddress): string {

    const r1 = this.getValue()

    if (r1 == "none") return ""

    const isV = isIncludeV()
    if (isIncludeChap() == false) {
      if (isV) return `v${addr.verse}`
      return `${addr.verse}`
    }
    if (isIncludeBookName() == false) {
      return getChapVerseString()
    }

    const bookName = DisplayLangSetting.s.getBookNameOfLangSet(addr.book)
    return `${bookName}${getChapVerseString()}`

    function getChapVerseString() {
      if (isV) return `${addr.chap}v${addr.verse}`
      return `${addr.chap}:${addr.verse}`
    }
    function isIncludeBookName() {
      return Enumerable.from(["創1:1", "創1v1", "创1:1", "创1v1", "Ge1:1", "Ge1v1"]).any(a1 => a1 == r1)
      // return Enumerable.from(["1:1", "1v1", "1", "v1", "none"]).all(a1 => a1 != r1)
    }
    function isIncludeColon() {
      return /:/.test(r1)
    }
    function isIncludeV() {
      return /v/.test(r1)
    }
    function isIncludeChap() {
      return Enumerable.from(["1", "v1", "none"]).all(a1 => a1 != r1)
    }

  }
  /**
 * 併排排版顯示主頁面經文用，依設定
 * (暫時無用，因為被 verserange 取代了，可15章)
 * @param isForceBookChap 之所以要這個，在主顯示時，若是交互參照時，可能會多書卷多章節，此時，只擁有一節的人是無法判斷出來的，要從外部傳入
 *  
 */
  getDisplayOfVerseRange(verseRange: VerseRange, isForceBookChap: boolean): string {
    // 讓下面不需每次都作判斷
    if (isEmpty()) return ""
    const addrs = verseRange.verses

    // 若是交互參照，也就是說會同時顯示多卷書的內容，就仍然要顯示「書名」，僅管設定沒有卷名
    // 承上，若是跨章，就仍然要顯示「章」，僅管設定沒有卷名
    if (isForceBookChap) {
      return getResultViaVerseRangeToString() // TODO: 其實 over one chap 應該還要另外開發，但優先權低
    }

    // 只包含一節是 9 成以上，因此，先有簡單的判斷可優化效率
    if (addrs.length == 1) return this.getDisplayOfAddr(addrs[0])

    const tpFormat = this.getValue()

    if (tpFormat == "none") return ""

    return getResultOnlyOneChap()
    // --------------------------------
    function isEmpty() { return verseRange.verses == null || verseRange.verses.length == 0 }
    function isIncludeBookName() {
      return Enumerable.from(["創1:1", "創1v1", "创1:1", "创1v1", "Ge1:1", "Ge1v1"]).any(a1 => a1 == tpFormat)
      // return Enumerable.from(["1:1", "1v1", "1", "v1", "none"]).all(a1 => a1 != r1)
    }
    function getResultViaVerseRangeToString() {
      if (DisplayLangSetting.s.getValueIsEnglish()) return verseRange.toStringEnglishShort()
      if (DisplayLangSetting.s.getValueIsGB()) return verseRange.toStringChineseGBShort()
      return verseRange.toStringChineseShort()
    }
    function getResultOnlyOneChap() {
      // 簡易版: assert ( cntChap == 1 && isOrder == 1)
      const isV = isIncludeV()
      if (isIncludeChap() == false) {
        if (isV) return `v${getVersesString()}`
        return `${getVersesString()}`
      }
      if (isIncludeBookName() == false) {
        return getChapVerseString()
      }

      const book = addrs[0].book // assert one book
      const bookName = DisplayLangSetting.s.getBookNameOfLangSet(book)
      return `${bookName}${getChapVerseString()}`
      // ----------------------------------------------------------------
      function getVersesString() {
        const verses = Enumerable.from(addrs).select(a1 => a1.verse).toArray()
        return new VersesToStringWhereOneChapAndIsOrder().main(verses)
      }
      function getChapVerseString() {
        const chap = addrs[0].chap // assert one chap
        if (isV) return `${chap}v${getVersesString()}`
        return `${chap}:${getVersesString()}`
      }
      function isIncludeV() {
        return /v/.test(tpFormat)
      }
      function isIncludeChap() {
        return Enumerable.from(["1", "v1", "none"]).all(a1 => a1 != tpFormat)
      }
    }
  }
}
/**
 * 產生類似 1-2,4,6,10-13 這樣的字串
 * 用於 顯示經文時，經文範圍只有一章時 (也就是說，不是交互參照，包含多書卷多章節的簡單Case)
 */
class VersesToStringWhereOneChapAndIsOrder {
  main(data: number[]): string {
    // const data = [1, 2, 4, 6, 10, 11, 12, 13]
    const resultSplit = split()
    return gStr()
    function split(): number[][] {
      const result: number[][] = [];
      let currentRange: number[] = [];

      for (let i = 0; i < data.length; i++) {
        const current = data[i];
        const previous = data[i - 1];

        if (previous === undefined || current !== previous + 1) {
          if (currentRange.length > 0) {
            result.push(currentRange);
          }
          currentRange = [current];
        } else {
          currentRange.push(current);
        }
      }

      if (currentRange.length > 0) {
        result.push(currentRange);
      }

      return result;
    }
    function gStr(): string {
      return Enumerable.from(resultSplit).select(a1 => {
        if (a1.length == 1) return `${a1[0]}`
        return `${a1[0]}-${a1[a1.length - 1]}`
      }).toArray().join(',')
    }
  }
}