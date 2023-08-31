import { DAddress } from 'src/app/bible-address/DAddress';
import { ApiSc, DApiScResult } from 'src/app/fhl-api/ApiSc';
import { linq_range } from 'src/app/linq-like/linq_range';
import { NumberStringGet, NumberType } from './NumberStringGet';
import { ICommentToolDataGetter, DCommentOneData, DCommentQueryResult } from './comment-tool-interfaces';
import { ScApiNextPrevGetter } from '../../fhl-api/ScApiNextPrevGetter';
import { lastValueFrom } from 'rxjs';


export class CommentToolDataGetter implements ICommentToolDataGetter {

  async mainAsync(address: DAddress): Promise<DCommentQueryResult> {
    const re1 = await this.getDataFromApi(address);
    // console.log(re1);

    const { reNext, rePrev } = new ScApiNextPrevGetter().getNextAndPrev(re1);
    const reTitle =  re1.record[0].title;
    const reData = this.getData(re1);

    return {
      title: reTitle,
      next: reNext,
      prev: rePrev,
      data: reData
    };
  }
  private getData(re1: DApiScResult) {
    const str = re1.record[0].com_text;
    const r1 = str.replace(/\r/g, '').split('\n');
    const re2 = this.tryClassifyEachLine(r1);
    // console.log(re2);
    const re3 = this.mergeNormalText(re2);
    // console.log(re3);
    const reData = this.createTree(re3);
    // console.log(reData);
    return reData;
  }



  private createTree(re3) {
    const re4: DCommentOneData[] = [];
    let preLast: DCommentOneData;
    for (let i1 = 0; i1 < re3.length; i1++) {
      const it1 = re3[i1];
      if (it1.idxReg === undefined) {
        re4.push({ idx: i1, w: it1.w, level: 0 }); // case 0 (第一筆,但卻是沒階層的- 1,0,0)
        continue;
      }

      if (preLast === undefined) {
        preLast = { level: 0, w: it1.w, idx: i1, cnt0: it1.cntZero, iReg: it1.idxReg, children: [] };
        re4.push(preLast); // case 1 (第一筆)
        continue;
      }
      const fnIsSpecialEqual = () => {
        const iRegLimit = 10 - 4; // idx can 6,7,8,9
        if (it1.idxReg < iRegLimit) {
          return false;
        }
        if (Math.abs(preLast.cnt0 - it1.cntZero) === 0 ) {
          return true;
        }
        return false;
      };

      if (preLast.iReg !== it1.idxReg && fnIsSpecialEqual() === false) {
        if (preLast.cnt0 < it1.cntZero) {
          const r1: DCommentOneData = {
            w: it1.w, idx: i1, cnt0: it1.cntZero, iReg: it1.idxReg, children: [],
            parent: preLast, level: preLast.level + 1
          };
          preLast.children.push(r1);  // case 2 (向下找 )
          preLast = r1;
          continue;
        } else {
          // find 同伴(iReg與it一樣的)
          let itFind = preLast.parent;
          while (itFind !== undefined && itFind.iReg !== it1.idxReg) {
            itFind = itFind.parent;
          }
          if (itFind === undefined || itFind.parent === undefined) {
            preLast = { level: 0, w: it1.w, idx: i1, cnt0: it1.cntZero, iReg: it1.idxReg, children: [] };
            re4.push(preLast);
            continue;  // case 5 (回去向上找，但找到根了)
          }

          const r1: DCommentOneData = {
            w: it1.w,
            idx: i1, cnt0: it1.cntZero, iReg: it1.idxReg, children: [],
            parent: itFind.parent, level: itFind.level
          };
          itFind.parent.children.push(r1);
          preLast = r1;
          continue; // case 4  (回去向上找)
        }
      } else {
        const r1: DCommentOneData = {
          w: it1.w,
          idx: i1, cnt0: it1.cntZero, iReg: it1.idxReg, children: [],
          parent: preLast.parent, level: preLast.level
        };
        if ( preLast.parent === undefined ){
          re4.push(r1);
        } else {
          preLast.parent.children.push(r1);
        }
        preLast = r1;
        continue; // case 3 (旁邊一樣的)
      }
    }
    return re4;
  }
  private mergeNormalText(re2: { w: string; idxLine: number; idxReg?: number; cntZero?: number; }[]) {
    let iR: number;
    for (let i1 = 0; i1 < re2.length; i1++) {
      const it1 = re2[i1];
      if (it1.idxReg === undefined) {
        if (iR !== undefined) {
          re2[iR].w += it1.w;
          it1.w = undefined;
        }
        if (iR === undefined) {
          iR = i1;
        }
      } else {
        iR = i1;
      }
    }
    const re3 = re2.filter(a1 => a1.w !== undefined);
    return re3;
  }

  private tryClassifyEachLine(strs: string[]): { w: string, idxLine: number, idxReg?: number, cntZero?: number }[] {
    const re2 = [];
    const regs = this.generateRegexs();
    for (let i1 = 0; i1 < strs.length; i1++) {
      const it1 = strs[i1];
      let idxReg: number;
      let cntZero: number;
      for (let i2 = 0; i2 < regs.length; i2++) {
        const it2 = regs[i2];
        const r2 = it2.exec(it1);
        if (r2 !== null) {
          idxReg = i2;
          if (r2[1] === undefined) {
            cntZero = 0;
          } else {
            cntZero = r2[1].length;
          }
          break;
        }
      }
      if (idxReg !== undefined) {
        re2.push({ w: it1.trim(), idxLine: i1, idxReg, cntZero });
      } else {
        re2.push({ w: it1.trim(), idxLine: i1 });
      }
    }
    return re2;
  }
  private generateRegexs() {
    // const ulistTp1 = '●';
    // const ulistTp2 = '◎';
    // const ulistTp3 = '○';
    // const ulistTp4 = '☆';
    // const listTp5 =
    // 壹、 貳、
    const rr1 = linq_range(0, 9).map(a1 => new NumberStringGet().main(a1, NumberType.壹) + '、');
    const reg1 = new RegExp(`^(\\s*)(?:${rr1.join('|')})`, 'i');

    const rr2 = linq_range(1, 99).map(a1 => new NumberStringGet().main(a1, NumberType.一));
    // 一、 二、 三、
    const rr2a = rr2.map(a1 => a1 + '、').join('|');
    const reg2 = new RegExp(`^(\\s*)(?:${rr2a})`, 'i');

    // （一）（二）
    const rr3 = rr2.map(a1 => '（' + a1 + '）').join('|');
    const reg3 = new RegExp(`^(\\s*)(?:${rr3})`, 'i');

    // 1. 2. 3. 4. 注意! '.' 是reg中的特殊符號
    const rr4 = linq_range(0, 99).map(a1 => a1 + '\\.').join('|');
    const reg4 = new RegExp(`^(\\s*)(?:${rr4})`, 'i');

    // (1) (2) (3) (4) 注意! '(' ')' 是reg中的特殊符號
    const rr5 = linq_range(0, 99).map(a1 => '\\(' + a1 + '\\)').join('|');
    const reg5 = new RegExp(`^(\\s*)(?:${rr5})`, 'i');

    // a. b. c. d. e. 注意! '.'是reg中的特殊符號
    const rrr5 = linq_range(1, 26).map(a1 => new NumberStringGet().main(a1, NumberType.a) + '\\.').join('|');
    const reg55 = new RegExp(`^(\\s*)(?:${rrr5})`, 'i');

    const reg6 = new RegExp(`^(\\s*)●`, 'i');
    const reg7 = new RegExp(`^(\\s*)◎`, 'i');
    const reg8 = new RegExp(`^(\\s*)○`, 'i');
    const reg9 = new RegExp(`^(\\s*)☆`, 'i');
    // 10 個，後4個是特別項目 idxReg = 6,7,8,9 都是特別處理
    return [reg1, reg2, reg3, reg4, reg5, reg55, reg6, reg7, reg8, reg9];
  }

  private async getDataFromApi(address: DAddress) {
    // const re1 = test1();
    const re1 = await lastValueFrom(new ApiSc().queryScAsync({ bookId: 3, address }) );
    return re1;
  }
}

