import { BookNameAndId } from 'src/app/const/book-name/BookNameAndId';
import { VerseRange } from 'src/app/bible-address/VerseRange';
import { DOneLine } from "src/app/bible-text-convertor/DOneLine";
import Enumerable from 'linq';
import { cvt_cbol } from '../bible-text-convertor/cvt_cbol';
import { cvt_others } from "../bible-text-convertor/cvt_others";
import { DQsbResult } from '../fhl-api/ApiQsb';
import { VerGetDisplayName } from '../fhl-api/BibleVersion/VerGetDisplayName';



export class DQsbResult2DOneLineConvertor {
  // ver: 這是一個 version 
  // addresses: 雖然 data 也有 address, 但這個 address 指的是目前網頁，因為可能，有時候預設的'章' 會用到
  main(ver: string, data: DQsbResult, addresses: VerseRange) {
    // interface 定義
    interface DRecord { bible_text: string; chap: number; chineses: string; engs: string; sec: number; }

    try{
      // 將 DQsbResult 中的 每節經文 轉為 DOneLine
      const apiResult = data as { record: DRecord[]; };
      let dataEachVerses = convertToDOneLines(apiResult.record);
      
      // 不同譯本，選用不同的轉換
      if (ver == 'cbol') {
        dataEachVerses = cvt_cbol(dataEachVerses, addresses);        
      } else {
        dataEachVerses = cvt_others(dataEachVerses, addresses, ver);
      }
      Enumerable.from(dataEachVerses).where(a1=>a1.ver == undefined).forEach(a1=>a1.ver = ver) // cvt_cbol 後，ver會不見, 和合本 約一2:9 也會，所以就放在這吧
      return dataEachVerses;
    }catch{
      const ver2 = new VerGetDisplayName().main(ver)
      const re: DOneLine = {
        ver: ver,
        children: [{w:`【${ver2} 處理 DText轉換 出現錯誤，請回報 經文章節 與 譯本名稱。】`}],
        addresses: addresses
      }
      console.log(re);
      
      return [re]
    }

    function convertToDOneLines(records: DRecord[]) {
      return Enumerable.from(records).select(a1 => {
        const vr = new VerseRange();
        const bk = new BookNameAndId().getIdOrUndefined(a1.chineses);
        vr.add({ book: bk, chap: a1.chap, verse: a1.sec });

        const re: DOneLine = {
          children: [{ w: a1.bible_text }],
          addresses: vr,
          ver: ver
        };
        return re;
      }).toArray();
    }
  }
}
