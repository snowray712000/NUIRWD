import { DOneLine } from 'src/app/bible-text-convertor/AddBase';
import { IDatasQueryor, DArgsDatasQueryor } from '../../version-interlace/version-interlace.component';
import { VerseRange } from 'src/app/bible-address/VerseRange';
/** 很重要的測試資料, 也可視為顯示格式 */
export class VersionTnterlaceDatasQueryorStandardTestData implements IDatasQueryor {
  async queryDatasAsync(args: DArgsDatasQueryor): Promise<DOneLine[]> {
    // 測試 case
    // 基本
    const rr1 = { children: [{ w: '「　神愛世人，甚至將他的獨生子賜給他們，叫一切信他的，不致滅亡，反得永生。' }], addresses: VerseRange.fD('約3:16'), ver: '和合本' };
    const rr2 = { children: [{ w: '上帝那麼愛世人，甚至賜下他的獨子，要使所有信他的人不致滅亡，反得永恆的生命。' }], addresses: VerseRange.fD('約3:16'), ver: '現代中文譯本修訂版' };

    // Orig 新約 舊約
    const rr3: DOneLine = {
      children: [
        { w: '{<G1161>}', sn: '1161', tp: 'G' },
        { w: '耶穌' },
        { w: '<G846>', sn: '846', tp: 'G' },
        { w: '以下略...' },
        { w: '起初' },
        { w: '<H09002>', sn: '09002', tp: 'H' },
        { w: '<H07225>', sn: '07225', tp: 'H' },
        { w: '以下略...' },
      ], addresses: VerseRange.fD('太24:3;創1:1'),
    };

    // 交互參照
    const rr4: DOneLine = {
      children: [
        { w: '這世代終結的預兆（', isTitle1: 1 },
        { w: '可13:3~13；路21:7~19', isTitle1: 1, isRef: 1, refDescription: '可13:3-13；路21:7-19' },
        { w: '）', isTitle1: 1 },
        { w: '耶穌坐在橄欖山上，門徒暗中前來問他：「請告訴我們，甚麼時候會有這些事呢？你的降臨和這世代的終結，有甚麼預兆呢？」' },
        { w: '可13:3~13；路21:7~19', isRef: 1, refDescription: '可13:3-13；路21:7-19' },
      ], addresses: VerseRange.fD('太24:3'),
    };

    // 舊約瑪索拉原文 (傳1:1)
    /*

    */
    const rr5: DOneLine = {
      children: [
        { w: getOldRR5() }
      ], addresses: VerseRange.fD('傳1:1'),
    };
    const rr6: DOneLine = {
      children: [{ w: '到了指定的時候' },
      { w: '【180】', foot: { engs: 'Gen', chap: 4, version: 'cnet', id: 180 } },
      { w: '，該隱拿地裏的出產為供物獻' },
      { w: '【181】', foot: { engs: 'Gen', chap: 4, version: 'cnet', id: 181 } },
      { w: '給耶和華，' }],
      addresses: VerseRange.fD('創4:3'),
      ver: 'NET聖經中譯本',
    };
    const rr6b: DOneLine = {
      children: [{
        w: '那人和他妻子夏娃同房，夏娃就懷孕，生了該隱'
      }, { w: '([4.1]「該隱」意思是「得」。)', foot: { text: '「該隱」意思是「得」。' } }, {
        w: '，她說：「我靠耶和華得了一個男的。」'
      }],
      addresses: VerseRange.fD('創4:1'),
      ver: '和合本2010',
    };
    const rr7a: DOneLine = {
      children: [{ w: '該隱', isName: 1 },
      { w: '與妻子同房，她就懷孕，生了' }, { w: '以諾', isName: 1 },
      { w: '。該隱建造一座城，就照他兒子的名字稱那城為' }, { w: '以諾', isName: 1 }, { w: '。' }],
      addresses: VerseRange.fD('創4:17'),
      ver: '和合本2010',
    };

    const rr8a: DOneLine = {
      children: [
        { w: '耶穌聽了，十分感慨，對跟隨他的人說：' },
        { w: '「我確實地告訴你們：在以色列我沒有見過有這麼大信心', isGODSay: 1 },
        { w: '【1】', isGODSay: 1, foot: { version: 'csb', id: 1, engs: 'Matt', chap: 8 } },
        { w: '的人。', isGODSay: 1 }
      ],
      addresses: VerseRange.fD('太8:10'),
      ver: '中文標準譯本',
    };

    const rr9a: DOneLine = {
      children: [{ w: '論到你們信上所提的事，' }, { w: '我說', isOrigNotExist: 1 }, { w: '男不近女倒好。' }],
      addresses: VerseRange.fD('林前7:1'),
      ver: '和合本',
    };

    const rr10a: DOneLine = {
      children: [{ w: '起初，　神創造天地。...1-2' }],
      addresses: VerseRange.fD('創7:1-2'),
    };
    const rr10b: DOneLine = {
      children: [{ w: '起初，　神創造天地。...1,3' }],
      addresses: VerseRange.fD('創7:1,3'),
    };
    const rr10c: DOneLine = {
      children: [{ w: '起初，　神創造天地。...2,1' }],
      addresses: VerseRange.fD('創7:2,1'),
    };
    const rr10d: DOneLine = {
      children: [{ w: '起初，　神創造天地。...' }],
      addresses: VerseRange.fD('創7:1-8:1'),
    };
    const rr10e: DOneLine = {
      children: [{ w: '起初，　神創造天地。' }],
      addresses: VerseRange.fD('創7:1-8:1;出3:1'),
    };

    // 合併
    const rr11a: DOneLine = {
      children: [{ w: '起初，　神創造天地。' }], addresses: VerseRange.fD('創1:1'),
    };
    const rr11b: DOneLine = {
      children: [{ w: '神的靈...' }], addresses: VerseRange.fD('創1:2'),
    };
    const rr11c: DOneLine = {
      children: [{ w: '神說...' }], addresses: VerseRange.fD('創1:3'),
    };

    // 搜尋後, 關鍵字上色
    const rr12a: DOneLine = {
      // tslint:disable-next-line: max-line-length
      children: [{ w: '你', keyIdx0based: 0 }, { w: '們要彼此相' }, { w: '愛', keyIdx0based: 2 }, { w: '，像' }, { w: '我', keyIdx0based: 1 }, { w: '愛', keyIdx0based: 2 }, { w: '你', keyIdx0based: 0 }, { w: '們一樣；這就是' }, { w: '我', keyIdx0based: 1 }, { w: '的命令。' }], addresses: VerseRange.fD('約15:12'),
    };
    const rr12b: DOneLine = {
      // tslint:disable-next-line: max-line-length
      children: [{ w: 'key0', keyIdx0based: 0 }, { w: 'key1', keyIdx0based: 1 }, { w: 'key2', keyIdx0based: 2 }, { w: 'key3', keyIdx0based: 3 }, { w: 'key4', keyIdx0based: 4 }, { w: 'key5', keyIdx0based: 5 }, { w: 'key6', keyIdx0based: 6 }, { w: 'key7', keyIdx0based: 7 }, { w: 'key8', keyIdx0based: 8 },], addresses: VerseRange.fD('創1:1'),
    };
    const rr12c: DOneLine = {
      // tslint:disable-next-line: max-line-length 1519 in 4100 believe
      children: [{ w: 'Let' }, { w: '<G5015>', sn: 'G5015' }, { w: '<G0>', sn: '0' }, { w: ' not' }, { w: '<G3361>', sn: 'G3361' }, { w: ' your' }, { w: '<G5216>', sn: 'G5216' }, { w: ' heart' }, { w: '<G2588>', sn: 'G2588' }, { w: ' be troubled' }, { w: '<G5015>', sn: 'G5015' }, { w: '(G5744)', sn: 'G5744' }, { w: ': ye believe' }, { w: '<G4100>', sn: 'G4100', keyIdx0based: 1, }, { w: '(G5719)', sn: 'G5719' }, { w: '(G5720)', sn: 'G5720' }, { w: ' in' }, { w: '<G1519>', sn: 'G1519', keyIdx0based: 0, }, { w: ' God' }, { w: '<G2316>', sn: 'G2316' }, { w: ', believe' }, { w: '<G4100>', sn: 'G4100', keyIdx0based: 1, }, { w: '(G5719)', sn: 'G5719' }, { w: '(G5720)', sn: 'G5720' }, { w: ' also' }, { w: '<G2532>', sn: 'G2532' }, { w: ' in' }, { w: '<G1519>', sn: 'G1519', keyIdx0based: 0, }, { w: ' me' }, { w: '<G1691>', sn: 'G1691' }, { w: '.' }], addresses: VerseRange.fD('創1:1'),
    };

    return [gg('版本顯示'), rr1, rr2,
    gg('原文Click'), rr3,
    gg('交互參照'), rr4,
    gg('舊約瑪索拉原文 (傳1:1)'), rr5,
    gg('註腳'), rr6, rr6b,
    gg('私名號: 人名、地點'), rr7a,
    gg('GOD Say'), rr8a,
    gg('虛點點'), rr9a,
    gg('章節顯示 VerseOnly'), rr10a, rr10b, rr10c, rr10d, rr10e,
    gg('Smart合併'), rr11a, rr11b, rr11c,
    gg('搜尋後關鍵字上色'), rr12a, rr12b, rr12c,
    ];
    function gg(str: string): DOneLine {
      return { children: [{ isBr: 1 }, { w: str, isTitle1: undefined }, { isBr: 1 }, { isBr: 1 }] };
    }
    function getOldRR5() {
      const rrr1 = '`I~\'l\'vWryiB %,l,m dIw"D-!,B t,l,hoq yEr.bID';
      // tslint:disable-next-line: max-line-length
      return '\u05d0\u05b7\u05e3 \u05d7\u05b8\u05db\u05b0\u05de\u05b8\u05ea\u05b4\u05d9 \u05e2\u05b8\u05de\u05b0\u05d3\u05b8\u05d4 \u05dc\u05bc\u05b4\u05d9\u05c3\n\r\u05de\u05b4\u05db\u05bc\u05b9\u05dc \u05e9\u05c1\u05b6\u05d4\u05b8\u05d9\u05b8\u05d4 \u05dc\u05b0\u05e4\u05b8\u05e0\u05b7\u05d9 \u05d1\u05bc\u05b4\u05d9\u05e8\u05d5\u05bc\u05e9\u05c1\u05b8\u05dc\u05b8\u05dd\u05b4\n\r\u05d5\u05b0\u05d2\u05b8\u05d3\u05b7\u05dc\u05b0\u05ea\u05bc\u05b4\u05d9 \u05d5\u05b0\u05d4\u05d5\u05b9\u05e1\u05b7\u05e4\u05b0\u05ea\u05bc\u05b4\u05d9';
      return rrr1;
    }
  }
}
