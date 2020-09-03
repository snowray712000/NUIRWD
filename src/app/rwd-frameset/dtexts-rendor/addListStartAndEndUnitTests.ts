import { DListAdd, addListStartAndEnd } from './addListStartAndEnd';
import { DText } from 'src/app/bible-text-convertor/AddBase';

export function addListStartAndEndUnitTests() {
  let r1: DListAdd[] = [];
  let r2: DText[] = [];
  r1 = [
    { list: [1], data: { w: '1) 希臘文第一個字母' } },
    { list: [2], data: { w: '2) 阿拉法. 基督是阿拉法, 是俄梅戛. 意指祂是始, 祂是終.' } },
  ];
  // 分析第0層, 會得到 0-1 是一個 order [[0,1]]
  // [0,1] 去分析, 其中有哪些 List. 可得 [0,0] [1,1] 兩組
  // 注意, 為何不是得到 0, 1 兩組, 而是用 0,0 1,1. 因為可能這個 list 是多個組成.
  // 要在 0-1 上下插入 OrderStart 與 OrderEnd <ol>
  // <此時的 datas 應後是 4行了>
  // 所以 0,0 變 1,1 ; 1,1 變 2,2 了
  // li 從後面開始插, 比較好作 ... 不然先插 1,1 的話, 2,2 又要變成 4,4
  // 處理2,2. 在3插入End, 在2插入Start
  // 處理1,1. 在2插入End, 在1插入Start
  // 完成
  r2 = addListStartAndEnd(r1).map(a1 => a1.data);
  console.log(JSON.stringify(r1));
  console.log(JSON.stringify(r2));

  r1 = [
    { data: { w: '亞倫 = "帶來光的人"' } },
    { list: [1], data: { w: '1) 摩西的兄弟。是第一位以色列的祭司，以及祭司階級的首領。' } },
  ];
  // 分析第0層, 得到 order [1,1]
  // 分析 order[1,1] 得到 [1,1] list 一組
  // 於2插入 Order End, 於1插入Order Start ... 1,1 變成 2,2
  // 處理2,2。於2插入 List End, 於1插入 List Start
  // 完成。
  r2 = addListStartAndEnd(r1).map(a1 => a1.data);
  console.log(JSON.stringify(r1));
  console.log(JSON.stringify(r2));

  r1 = [
    { data: { w: '阿爸 = "父親"' } },
    { list: [1], data: { w: '1) 摩西的兄弟。是第一位以色列的祭司，以及祭司階級的首領。' } },
    { list: [1], data: { w: '   在新約聖經中無論何時出現, 一定會有希臘文的解釋.' } },
    { list: [1], data: { w: '   後來說希臘語的基督徒採用作為禮儀用詞.' } },
  ];
  // 分析第0層, 得到一組 order 1,3
  // 分析 order 1,3 得到一組 list 1,3
  // 於4插入 Order End, 於1插入 Order Start ... 1,3 變成 2,4
  // 處理2,4。於4插入 List End; 於2插入 List Start
  // 完成。
  r2 = addListStartAndEnd(r1).map(a1 => a1.data);
  console.log(JSON.stringify(r1));
  console.log(JSON.stringify(r2));

  // G18 難
  r1 = [
    { list: [1], data: { w: '1) 優質的' } },
    { list: [1, 1], data: { w: ' 1a)有用的,有益的' } },
    { list: [1, 2], data: { w: ' 1b)好東西,財物' } },
    { list: [2], data: { w: '2) 極有價值,優點的' } },
    { list: [2], data: { w: '形容詞' } },
    { list: [2, 1], data: { w: ' 2a)形容神祇或人' } },
    { list: [2, 2], data: { w: ' 2b)形容東西,特別是其社會性的意義與價值' } },
    { list: [2], data: { w: '實名詞' } },
    { list: [2, 3], data: { w: ' 2c)有好處的,有幫助的' } },
    { list: [2, 4], data: { w: ' 2d)好行為 ( 約 5:29 ) ' } },
  ];
  // 分析第0層, 得到 order 一組 0,9
  // 分析 order 0,9 得到 list 二組 0,2 And 3,9
  // 處理 order 0,9 ... 於10插入 order end 於0插入 order start ... 0,2 變 1,3 ; 3,9 變 4,10
  // 處理 list 4,10 ... 於11插入 list end 於4插入 list start
  // 處理 list 1,3 ... 於4插入 list end 於1插入 list start
  // 分析第1層前, 目前資料如下:
  // r1 = [
  //   { data: { isOrderStart: 1 } }, // [0]
  //   { data: { isListStart: 1 } },
  //   { list: [1], data: { w: '1) 優質的' } },
  //   { list: [1, 1], data: { w: ' 1a)有用的,有益的' } },
  //   { list: [1, 2], data: { w: ' 1b)好東西,財物' } },
  //   { data: { isListEnd: 1 } }, // [5]
  //   { data: { isListStart: 1 } },
  //   { list: [2], data: { w: '2) 極有價值,優點的' } },
  //   { list: [2], data: { w: '形容詞' } },
  //   { list: [2, 1], data: { w: ' 2a)形容神祇或人' } },
  //   { list: [2, 2], data: { w: ' 2b)形容東西,特別是其社會性的意義與價值' } }, // [10]
  //   { list: [2], data: { w: '實名詞' } },
  //   { list: [2, 3], data: { w: ' 2c)有好處的,有幫助的' } },
  //   { list: [2, 4], data: { w: ' 2d)好行為 ( 約 5:29 ) ' } },
  //   { data: { isListEnd: 1 } },
  //   { data: { isOrderEnd: 1 } }, // [15]
  // ];
  // 分析第1層, 得到 order 三組 [3,4] [9,10] [12,13]
  // 分析 12,13 order, 得到 二組 list 12,12 13,13
  // 處理 12,13 order, 在14插入 order end, 12插入 order start, 12,12 13,13 變 13,13 14,14
  // 處理 14,14 list, 在15插入 listend, 14插入 list start
  // 處理 13,13 list, 在14插入 listend, 13插入 list start
  // 分析 9,10 order, 得到 二組 list 9,9 10,10
  // 處理 ... 變 10,10, 11,11
  // 處理 11,11 list ...
  // 處理 10,10 list ...
  // 分析 3,4 order, 得到 二組 list  .....
  // ....
  // 完成
  r2 = addListStartAndEnd(r1).map(a1 => a1.data);
  console.log(JSON.stringify(r1));
  console.log(JSON.stringify(r2));



  // 路加福音 https://a2z.fhl.net/php/pcom.php?book=3&engs=Luke
  r1 = [
    { data: { w: '/**************************************************************************' } },
    { data: { isBr: 1 } },
    { data: { w: '自從2019年8月12日完成詩篇註釋以後，大家說要查路加福音，就來吧！' } },
    { data: { isBr: 1 } },
    { data: { isBr: 1 } },
    { data: { isBr: 1 } },
    { data: { w: '我們共有 tjm、Lisa、janewu、清桂、雅芳一同查考。' } },
    { data: { isBr: 1 } },
    { data: { isBr: 1 } },
    { data: { w: '//底下這是至少西元2000以前的文字，還是留著' } },
    { data: { isBr: 1 } },
    // tslint:disable-next-line: max-line-length
    { data: { w: '這一份路加福音查經資料是兩年前交大信望愛團契研究生小組查考路加福音時所未完成的，當時一起研經的人有些都當兵回來出國了。為了不要老是讓網路上老是堆著一些未完成研經資料的屍體，我趁著暑假趕了一下，希望能夠快點完成。無奈路加福音篇幅相當長，而我自己研究聖經的聚會也持續要另外查考其他的經卷，所以拖到現在終於是有一套完整的路加福音查經資料初版出現。' } },
    { data: { isBr: 1 } },
    { data: { isBr: 1 } },
    // tslint:disable-next-line: max-line-length
    { data: { w: '最近看到許多好的研經書籍出現在基督教書房，讓我一時興起不想繼續寫這種網路研經資料的想法。不過到底網路上的東西是不要錢的，也許透過我們拋磚引玉的發表可以讓更多人踩在我們的肩膀上前進，畢竟引用電子資料遠比引用書籍上的資料容易些，抄錄的功夫可以節省不少。另外想到一些遠在偏遠地區的基督徒，他們可能沒有辦法取得書籍的資料，雖然我們這些人不懂希臘文、希伯來文，也沒有辦法專心好好的研究聖經的解釋，但趁早提出一套完整的網路聖經解釋資料，幫助一些人早日解決一些疑惑與困難，也許是現階段我們可以做的事情，或者是掌握網路資源的我們最應該為大家做的事。' } },
    { data: { isBr: 1 } },
    { data: { isBr: 1 } },
    // tslint:disable-next-line: max-line-length
    { data: { w: '每次想到自己不夠水準的研究資料要丟到網路上，總得告訴自己：「網路上的資料修改很容易」才提得起勇氣把東西貼到網路上來。希望我們的努力多少幫助一些人更精確的瞭解聖經的內容，並藉此更進一步的瞭解我們所深信的基督耶穌。並希望有一天有更適合發表這種免費網路研經資料的人出來接續這項工作。' } },
    { data: { isBr: 1 } },
    { data: { w: '**************************************************************************/' } },
    { data: { isBr: 1 } },
    { data: { w: '路加福音查經資料' } },
    { data: { isBr: 1 } },
    { data: { isBr: 1 } },
  ];
  r2 = addListStartAndEnd(r1).map(a1 => a1.data);
  console.log(JSON.stringify(r1));
  console.log(JSON.stringify(r2));

  // 路加福音 https://a2z.fhl.net/php/pcom.php?book=3&engs=Luke
  r1 = [
    { list: [1], data: { w: '☆參考資料：' } },
    { list: [2], data: { w: '1.詹正義博士編輯，「活泉新約希臘文解經卷二─路加福音」，美國活泉出版社出版。' } },
    { list: [3], data: { w: '2.中國神學研究院編撰，「聖經串珠註釋本」，證道出版社出版。' } },
    { list: [4], data: { w: '3.巴克萊著，柳惠容譯，「路加福音註釋」，台灣長老教會青年事工委員會發行。' } },
    { list: [5], data: { w: '4.「啟導本聖經」，海天書樓出版。' } },
    { list: [6], data: { w: '5.「現代中文聖經註釋」，種籽出版社出版。' } },
    { data: { isBr: 1 } },
    { data: { isBr: 1 } },
    { list: [1], data: { w: '☆代號說明：' } },
    { list: [1, 1], data: { w: '  「●」：經文註釋' } },
    { list: [1, 2], data: { w: '  「◎」：個人感想與應用' } },
    { list: [1, 3], data: { w: '  「○」：相關經文' } },
    { list: [1, 4], data: { w: '  「☆」：特殊注意事項' } },
  ];
  // 分析, 最大層數 = 2
  // 分析第0層, 得到 order 二組, 0,5 與 8,12
  // 處理 order 8,12 ... 分析第0層, 得到一組 list 8,12
  // ... 於13插入 order end, 8插入 order start, list 變 9,13
  // ... 於14插入 list end, 9插入 list start,
  // 處理 order 0,5 ... 分析第0層, 得到六組 list 0,0 1,1 2,2 3,3 4,4 5,5 6,6
  r2 = addListStartAndEnd(r1).map(a1 => a1.data);
  console.log(JSON.stringify(r1));
  console.log(JSON.stringify(r2));
  /*
  */
}
