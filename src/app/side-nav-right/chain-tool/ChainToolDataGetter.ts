import { BibleBookNames } from 'src/app/const/book-name/BibleBookNames';
import { BookNameLang } from 'src/app/const/book-name/BookNameLang';
import { SplitStringByRegex } from 'src/app/tools/SplitStringByRegex';
import { IChainToolDataGetter, DChainToolDataResult } from './chain-tool-interfaces';
import { DAddress } from 'src/app/bible-address/DAddress';
import { ApiSc } from '../../fhl-api/ApiSc';
import { BookNameAndId } from 'src/app/const/book-name/BookNameAndId';
import { FixDesDefaultBookChap } from '../comment-tool/com-text/FixDesDefaultBookChap';
import { ScApiNextPrevGetter } from 'src/app/fhl-api/ScApiNextPrevGetter';
import { DisplayLangSetting } from 'src/app/rwd-frameset/dialog-display-setting/DisplayLangSetting';
import { lastValueFrom } from 'rxjs';
export class ChainToolDataGetter implements IChainToolDataGetter {
  reNext: DAddress;
  rePrev: DAddress;
  title: string;
  constructor() {
  }
  async mainAsync(address: DAddress): Promise<DChainToolDataResult> {
    const re1 = await this.getChainDataFromApi(address);
    const re2 = re1.replace(/\r/g, '').split('\n');
    const re3 = re2.map(a1 => this.parseOneLineAndGenerateRefenceDescription(a1));
    this.fixReferenceNoBookNameOrChapOrErrorFormat(address, re3);
    return {
      next: this.reNext,
      prev: this.rePrev,
      title: this.title,
      data: re3
    }
  }
  private parseOneLineAndGenerateRefenceDescription(a1: string) {
    const r1 = new SplitStringByRegex().main(a1, /#[^\|]+\|/g);
    // console.log(r1); // data: (3) [" ", "# Joh 1:18; Col 1:15; 1Ti 1:17; 6:16; Heb 11:27|", ""]
    const re3 = r1.data.filter(aa1 => aa1.length !== 0).map(aa1 => {
      const r2 = /#([^\|]+)\|/.exec(aa1);
      if (r2 === null) {
        return { w: aa1 };
      } else {
        const des = r2[1].trim();
        return { w: aa1, des };
      }
    });
    return re3;
  }
  /**
   * 2:1,15 要變 太2:1,15
   * 19,27 變為 太2:19,27
   * 太2:1; *Gr: 要變 太2:1;
   */
  // tslint:disable-next-line: max-line-length
  private fixReferenceNoBookNameOrChapOrErrorFormat(address: DAddress, re3: ({
    w: string;
    des?: string;
  })[][]) {
    const na = BibleBookNames.getBookName(address.book, BookNameLang.太);
    for (const it2 of re3) {
      for (const it1 of it2.filter(a1 => a1.des !== undefined)) {
        // 可能 2:1,15 ... 變為 太 2:1,15
        // // 可能 19,27 ... 變為 太 chap:19,27
        const r1 = new FixDesDefaultBookChap(address).fixDes(it1.des);
        if (r1 !== undefined) {
          it1.des = r1;
        }

        // 可能 *marg: 或 *Gr: 要拿掉 (獨立,不用在if裡)
        it1.des = it1.des.replace(/\s*\*[^\:]+\:/g, '');
      }
    }
  }
  private async getChainDataFromApi(address: DAddress) {
    const r1 = await lastValueFrom( new ApiSc().queryScAsync({ bookId: 4, address,isSimpleChinese: DisplayLangSetting.s.getValueIsGB() }));
    // console.log(r1);
    const { reNext, rePrev } = new ScApiNextPrevGetter().getNextAndPrev(r1);
    this.reNext = reNext;
    this.rePrev = rePrev;
    this.title = r1.record[0].title;

    const re1 = r1.record[0].com_text;
    return re1;
  }
}

