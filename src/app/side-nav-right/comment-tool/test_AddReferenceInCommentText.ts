import { DText } from './../../bible-text-convertor/AddBase';
import { UT } from 'src/app/unit-test-qunit/qunits/UT';
import { AddReferenceInCommentText } from './AddReferenceInCommentText';
export async function test_AddReferenceInCommentText() {
  const equal = UT.equal;
  return UT.gFnSafe(fns => {
    test1(); // #1:1-17|
    test2(); // #1:1
    test3(); // 腓2:7
    test4(); // 跨章 #1:18-3:20
    test5(); // 多組
    test6(); // 「、」連接,不同書卷
    test7();
    return;
    function test1() {
      const addr = { book: 45, chap: 1, verse: 1 }; // 羅1:1
      const src: DText[] = [
        { w: '引言（#1:1-17|）' }, { isBr: 1 }
      ];
      const dst = new AddReferenceInCommentText().main(src, addr);
      const dstExcept: DText[] = [
        { w: '引言（' }, { w: '#1:1-17|', isRef: 1, refDescription: '羅1:1-17' }, { w: '）' },
        { isBr: 1 }
      ];
      fns.push(equal('01.1:1-17', dstExcept, dst));
    }
    function test2() {
      const addr = { book: 45, chap: 1, verse: 1 }; // 羅1:1
      const src: DText[] = [
        { w: '（一）表明自己身分（#1:1|）' }
      ];
      const dst = new AddReferenceInCommentText().main(src, addr);
      const dstExcept: DText[] = [
        { w: '（一）表明自己身分（' }, { w: '#1:1|', isRef: 1, refDescription: '羅1:1' }, { w: '）' },
      ];
      fns.push(equal('02.1:1', dstExcept, dst));
    }
    function test3() {
      // 「生」：此處的「生」並不是一般用來指「生孩子」或「出生」的那個字，而是#腓 2:7|中指基督「成為」人樣式的那個字。亦即保羅很可能知道「童女懷孕」的事情，所以他很謹慎的使用文字。
      const addr = { book: 45, chap: 1, verse: 1 }; // 羅1:1
      const src: DText[] = [
        { w: '「生」：此處的「生」並不是一般用來指「生孩子」或「出生」的那個字，而是#腓 2:7|中指基督「成為」人樣式的那個字。亦即保羅很可能知道「童女懷孕」的事情，所以他很謹慎的使用文字。' }
      ];
      const dst = new AddReferenceInCommentText().main(src, addr);
      const dstExcept: DText[] = [
        // tslint:disable-next-line: max-line-length
        { w: '「生」：此處的「生」並不是一般用來指「生孩子」或「出生」的那個字，而是' }, { w: '#腓 2:7|', isRef: 1, refDescription: '腓2:7' }, { w: '中指基督「成為」人樣式的那個字。亦即保羅很可能知道「童女懷孕」的事情，所以他很謹慎的使用文字。' },
      ];
      fns.push(equal('03.腓2:7', dstExcept, dst));
    }
    function test4() {
      // 壹、由於普世的罪，人就需要公義（#1:18-3:20|）
      const addr = { book: 45, chap: 1, verse: 18 };
      const src: DText[] = [
        { w: '壹、由於普世的罪，人就需要公義（#1:18-3:20|）' }
      ];
      const dst = new AddReferenceInCommentText().main(src, addr);
      const dstExcept: DText[] = [
        // tslint:disable-next-line: max-line-length
        { w: '壹、由於普世的罪，人就需要公義（' }, { w: '#1:18-3:20|', isRef: 1, refDescription: '羅1:18-3:20' }, { w: '）' },
      ];
      fns.push(equal('04.跨章', dstExcept, dst));
    }
    function test5() {
      // ◎#2:24|的思想與#結 36:20-23|相似，保羅引用#賽 52:5|的同時。可能也暗引#結 36:20-23|。
      const addr = { book: 45, chap: 2, verse: 17 };
      const src: DText[] = [
        { w: '◎#2:24|的思想與#結 36:20-23|相似，保羅引用#賽 52:5|的同時。可能也暗引#結 36:20-23|。' }
      ];
      const dst = new AddReferenceInCommentText().main(src, addr);
      const dstExcept: DText[] = [
        // tslint:disable-next-line: max-line-length
        { w: '◎' },
        { w: '#2:24|', isRef: 1, refDescription: '羅2:24' },
        { w: '的思想與' },
        { w: '#結 36:20-23|', isRef: 1, refDescription: '結36:20-23', },
        { w: '相似，保羅引用' },
        { w: '#賽 52:5|', isRef: 1, refDescription: '賽52:5' },
        { w: '的同時。可能也暗引' },
        { w: '#結 36:20-23|', isRef: 1, refDescription: '結36:20-23', },
        { w: '。' },
      ];
      fns.push(equal('05.多組', dstExcept, dst));
    }
    function test6() {
      // ◎#申 10:16;30:6|、#耶 4:1-4|、#徒 7:51-56|都有提到心靈受割禮的事。
      const addr = { book: 45, chap: 2, verse: 17 };
      const src: DText[] = [
        { w: '◎#申 10:16;30:6|、#耶 4:1-4|、#徒 7:51-56|都有提到心靈受割禮的事。' }
      ];
      const dst = new AddReferenceInCommentText().main(src, addr);
      const dstExcept: DText[] = [
        // tslint:disable-next-line: max-line-length
        { w: '◎' },
        { w: '#申 10:16;30:6|、#耶 4:1-4|、#徒 7:51-56|', isRef: 1, refDescription: '申10:16;30:6;耶4:1-4;徒7:51-56' },
        { w: '都有提到心靈受割禮的事。' },
      ];
      fns.push(equal('06.「、」連接且不同書卷', dstExcept, dst));
    }
    function test7() {
      // ●有人認為保羅這段是答辯四種問題：#3:1-2|、#3:3-4|、#3:5-6|、#3:9|。
      const addr = { book: 45, chap: 3, verse: 1 };
      const src: DText[] = [
        { w: '●有人認為保羅這段是答辯四種問題：#3:1-2|、#3:3-4|、#3:5-6|、#3:9|。' }
      ];
      const dst = new AddReferenceInCommentText().main(src, addr);
      const dstExcept: DText[] = [
        // tslint:disable-next-line: max-line-length
        { w: '●有人認為保羅這段是答辯四種問題：' },
        { w: '#3:1-2|、#3:3-4|、#3:5-6|、#3:9|', isRef: 1, refDescription: '羅3:1-6,9' },
        { w: '。' },
      ];
      fns.push(equal('07.「、」連接同書卷', dstExcept, dst));
    }
  }, 'AddReferenceInCommentText exception');
}
