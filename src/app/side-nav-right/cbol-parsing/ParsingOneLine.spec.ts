import { lastValueFrom } from 'rxjs';
import { ParsingOneLine } from './ParsingOneLine';
import { ApiQp } from 'src/app/fhl-api/ApiQp';

describe('ParsingOneLine', () => {
  it('第1行', () => {
    const re = testData1();
    // tslint:disable-next-line: no-unused-expression
    let r1 = new ParsingOneLine('Καθὼς γέγραπται ἐν τῷ Ἠσαΐᾳ τῷ προφήτῃ,', re.record, 1);
    expect(r1.parsing().length).toBe(14);
    r1 = new ParsingOneLine('Καθὼς γέγραπται ἐν τῷ Ἠσαΐᾳ τῷ προφήτῃ,,,', re.record, 1);
    expect(r1.parsing().length).toBe(14);
    r1 = new ParsingOneLine('Καθὼς γέγραπται ἐν τῷ Ἠσαΐᾳ τῷ προφήτῃ', re.record, 1);
    expect(r1.parsing().length).toBe(13);
    r1 = new ParsingOneLine(',,,Καθὼς γέγραπται ἐν τῷ Ἠσαΐᾳ τῷ προφήτῃ', re.record, 1);
    expect(r1.parsing().length).toBe(14);
    r1 = new ParsingOneLine(',Καθὼς γέγραπται ἐν τῷ Ἠσαΐᾳ τῷ προφήτῃ', re.record, 1);
    expect(r1.parsing().length).toBe(14);
  });
  it('最後行', () => {
    const re = testData1();

    const rrr1 = 'Καθὼς γέγραπται ἐν τῷ Ἠσαΐᾳ τῷ προφήτῃ,\nἸδοὺ ἀποστέλλω τὸν ἄγγελόν μου πρὸ προσώπου σου,\nὃς κατασκευάσει τὴν ὁδόν σου·';
    const rrr2 = rrr1.split('\n');
    const rrr3 = rrr2.map(a1 => a1.split(' ').length);
    // console.log(rrr3); // 7 8 5

    // tslint:disable-next-line: no-unused-expression
    let r1 = new ParsingOneLine('ὃς κατασκευάσει τὴν ὁδόν σου·', re.record, 16);
    expect(r1.parsing().length).toBe(10);
    r1 = new ParsingOneLine('ὃς κατασκευάσει τὴν ὁδόν σου', re.record, 16);
    expect(r1.parsing().length).toBe(9);
    r1 = new ParsingOneLine('ὃς κατασκευάσει τὴν ὁδόν σου··', re.record, 16);
    expect(r1.parsing().length).toBe(10);
    r1 = new ParsingOneLine(',ὃς κατασκευάσει τὴν ὁδόν σου·', re.record, 16);
    expect(r1.parsing().length).toBe(11);
    r1 = new ParsingOneLine(',,ὃς κατασκευάσει τὴν ὁδόν σου·', re.record, 16);
    expect(r1.parsing().length).toBe(11);
  });
  it('韋聯+', () => {
    const r1 = testData2();
    // console.log(r1);
    // Ἀρχὴ τοῦ εὐαγγελίου Ἰησοῦ Χριστοῦ + + (υἱοῦ θεοῦ) +.
    // + 號也是其中一個物件, sn=00000
    const r2 = 'Ἀρχὴ τοῦ εὐαγγελίου Ἰησοῦ Χριστοῦ + + (υἱοῦ θεοῦ) +.';
    const r3 = new ParsingOneLine(r2, r1.record, 1);
    const r4 = r3.parsing();
    expect(r4[10].w).toBe('(韋:');
    expect(r4[12].w).toBe(')(聯:');
    expect(r4[18].w).toBe(')');
    console.log('韋聯okay');
  });
  it('韋聯+多行', () => {
    const r1 = testData3();
    // console.log(r1);
    const lines = [
      'ἐγένετο Ἰωάννης + ὁ + (ὁ) + βαπτίζων ἐν τῇ ἐρήμῳ ',
      '+ + καὶ + κηρύσσων βάπτισμα μετανοίας ',
      'εἰς ἄφεσιν ἁμαρτιῶν.',
    ];
    const cnts = lines.map(a1 => a1.trim().split(' ').length);
    // console.log(cnts); // [12,8,3] trim之後 [11, 7, 3], 要用 trim 之後的

    let r3 = new ParsingOneLine(lines[0], r1.record, 1);
    let r4 = r3.parsing();
    // console.log(r4);
    expect(r4[4].w).toBe('(韋:');
    expect(r4[8].w).toBe(')(聯:');
    expect(r4[12].w).toBe(')');

    r3 = new ParsingOneLine(lines[1], r1.record, 12);
    r4 = r3.parsing();
    // console.log(r4);
    expect(r4[0].w).toBe('(韋:');
    expect(r4[2].w).toBe(')(聯:');
    expect(r4[6].w).toBe(')');
    console.log('韋聯多行');
  });
});
function gCase(bk, ch, vs) {
  lastValueFrom(new ApiQp().queryQpAsync(bk, ch, vs)).then(a1 => {
    console.log(a1);
    console.log(JSON.stringify(a1));
  });
}
/** 馬可1:2, 多行 */
function testData1() {
  // tslint:disable-next-line: max-line-length
  return JSON.parse('{"status":"success","record_count":21,"N":0,"record":[{"id":24218,"engs":"Mark","chap":1,"sec":2,"wid":0,"word":"Καθὼς γέγραπται ἐν τῷ Ἠσαΐᾳ τῷ προφήτῃ,\\nἸδοὺ ἀποστέλλω τὸν ἄγγελόν μου πρὸ προσώπου σου, \\nὃς κατασκευάσει τὴν ὁδόν σου·","exp":"正如在先知以賽亞(書)中所寫的：\\n「看哪！我派遣...我的使者在你面前；(...處填入下一行)\\n{將要預備你的道路的}","chineses":"可","chinesef":"馬可福音"},{"id":24218,"engs":"Mark","chap":1,"sec":2,"wid":1,"word":"Καθὼς","sn":"02531","pro":"連接詞","wform":"","orig":"καθώς","exp":"正如","remark":""},{"id":24218,"engs":"Mark","chap":1,"sec":2,"wid":2,"word":"γέγραπται","sn":"01125","pro":"動詞","wform":"完成 被動 直說語氣 第三人稱 單數 ","orig":"γράφω","exp":"寫信、寫","remark":""},{"id":24218,"engs":"Mark","chap":1,"sec":2,"wid":3,"word":"ἐν","sn":"01722","pro":"介系詞","wform":"","orig":"ἐν","exp":"後接間接受格，意思是「在...之內、藉著」","remark":""},{"id":24218,"engs":"Mark","chap":1,"sec":2,"wid":4,"word":"τῷ","sn":"03588","pro":"冠詞","wform":"間接受格 單數 陽性   ","orig":"ὁ ἡ τό","exp":"視情況翻譯，有時可譯成「這個」、「那個」等","remark":""},{"id":24218,"engs":"Mark","chap":1,"sec":2,"wid":5,"word":"Ἠσαΐᾳ","sn":"02268","pro":"名詞","wform":"間接受格 單數 陽性   ","orig":"Ἠσαΐας","exp":"專有名詞，人名：以賽亞","remark":""},{"id":24218,"engs":"Mark","chap":1,"sec":2,"wid":6,"word":"τῷ","sn":"03588","pro":"冠詞","wform":"間接受格 單數 陽性   ","orig":"ὁ ἡ τό","exp":"視情況翻譯，有時可譯成「這個」、「那個」等","remark":""},{"id":24218,"engs":"Mark","chap":1,"sec":2,"wid":7,"word":"προφήτῃ","sn":"04396","pro":"名詞","wform":"間接受格 單數 陽性   ","orig":"προφήτης","exp":"先知","remark":""},{"id":24218,"engs":"Mark","chap":1,"sec":2,"wid":8,"word":"Ἰδοὺ","sn":"02400","pro":"質詞","wform":"","orig":"ἰδού","exp":"看哪！聽哪！在這裡","remark":""},{"id":24218,"engs":"Mark","chap":1,"sec":2,"wid":9,"word":"ἀποστέλλω","sn":"00649","pro":"動詞","wform":"現在 主動 直說語氣 第一人稱 單數 ","orig":"ἀποστέλλω","exp":"派遣","remark":""},{"id":24218,"engs":"Mark","chap":1,"sec":2,"wid":10,"word":"τὸν","sn":"03588","pro":"冠詞","wform":"直接受格 單數 陽性   ","orig":"ὁ ἡ τό","exp":"視情況翻譯，有時可譯成「這個」、「那個」等","remark":""},{"id":24218,"engs":"Mark","chap":1,"sec":2,"wid":11,"word":"ἄγγελόν","sn":"00032","pro":"名詞","wform":"直接受格 單數 陽性   ","orig":"ἄγγελος","exp":"使者、天使","remark":""},{"id":24218,"engs":"Mark","chap":1,"sec":2,"wid":12,"word":"μου","sn":"01473","pro":"人稱代名詞","wform":"所有格 單數    第一人稱 ","orig":"ἐγώ","exp":"我","remark":""},{"id":24218,"engs":"Mark","chap":1,"sec":2,"wid":13,"word":"πρὸ","sn":"04253","pro":"介系詞","wform":"","orig":"πρό","exp":"後接所有格，意思是「在...之前」","remark":""},{"id":24218,"engs":"Mark","chap":1,"sec":2,"wid":14,"word":"προσώπου","sn":"04383","pro":"名詞","wform":"所有格 單數 中性   ","orig":"πρόσωπον","exp":"臉","remark":""},{"id":24218,"engs":"Mark","chap":1,"sec":2,"wid":15,"word":"σου","sn":"04771","pro":"人稱代名詞","wform":"所有格 單數    第二人稱 ","orig":"σύ","exp":"你","remark":""},{"id":24218,"engs":"Mark","chap":1,"sec":2,"wid":16,"word":"ὃς","sn":"03739","pro":"關係代名詞","wform":"主格 單數 陽性   ","orig":"ὅς ἥ ὅ","exp":"帶出關係子句修飾先行詞","remark":""},{"id":24218,"engs":"Mark","chap":1,"sec":2,"wid":17,"word":"κατασκευάσει","sn":"02680","pro":"動詞","wform":"未來 主動 直說語氣 第三人稱 單數 ","orig":"κατασκευάζω","exp":"預備、建造","remark":""},{"id":24218,"engs":"Mark","chap":1,"sec":2,"wid":18,"word":"τὴν","sn":"03588","pro":"冠詞","wform":"直接受格 單數 陰性   ","orig":"ὁ ἡ τό","exp":"視情況翻譯，有時可譯成「這個」、「那個」等","remark":""},{"id":24218,"engs":"Mark","chap":1,"sec":2,"wid":19,"word":"ὁδόν","sn":"03598","pro":"名詞","wform":"直接受格 單數 陰性   ","orig":"ὁδός","exp":"道路","remark":""},{"id":24218,"engs":"Mark","chap":1,"sec":2,"wid":20,"word":"σου","sn":"04771","pro":"人稱代名詞","wform":"所有格 單數    第二人稱 ","orig":"σύ","exp":"你","remark":""}],"prev":{"chineses":"可","engs":"Mark","chap":1,"sec":1},"next":{"chineses":"可","engs":"Mark","chap":1,"sec":3}}');
}
/** 馬可1:1, 韋聯 */
function testData2() {
  // tslint:disable-next-line: max-line-length
  return JSON.parse('{"status":"success","record_count":11,"N":0,"record":[{"id":24217,"engs":"Mark","chap":1,"sec":1,"wid":0,"word":"Ἀρχὴ τοῦ εὐαγγελίου Ἰησοῦ Χριστοῦ + + (υἱοῦ θεοῦ) +.","exp":"耶穌基督、(韋: )(聯: 上帝的兒子)福音的開始。","chineses":"可","chinesef":"馬可福音"},{"id":24217,"engs":"Mark","chap":1,"sec":1,"wid":1,"word":"Ἀρχὴ","sn":"00746","pro":"名詞","wform":"主格 單數 陰性   ","orig":"ἀρχή","exp":"起初、首先","remark":""},{"id":24217,"engs":"Mark","chap":1,"sec":1,"wid":2,"word":"τοῦ","sn":"03588","pro":"冠詞","wform":"所有格 單數 中性   ","orig":"ὁ ἡ τό","exp":"視情況翻譯，有時可譯成「這個」、「那個」等","remark":""},{"id":24217,"engs":"Mark","chap":1,"sec":1,"wid":3,"word":"εὐαγγελίου","sn":"02098","pro":"名詞","wform":"所有格 單數 中性   ","orig":"εὐαγγέλιον","exp":"福音、好消息","remark":""},{"id":24217,"engs":"Mark","chap":1,"sec":1,"wid":4,"word":"Ἰησοῦ","sn":"02424","pro":"名詞","wform":"所有格 單數 陽性   ","orig":"Ἰησοῦς","exp":"專有名詞，人名：耶穌","remark":"為希伯來文人名「約書亞」的希臘文形式，原意是「上主是拯救」。"},{"id":24217,"engs":"Mark","chap":1,"sec":1,"wid":5,"word":"Χριστοῦ","sn":"05547","pro":"名詞","wform":"所有格 單數 陽性   ","orig":"Χριστός","exp":"基督（音譯）、承受膏油的、受膏者","remark":"為希伯來文「彌賽亞」的希臘文翻譯。"},{"id":24217,"engs":"Mark","chap":1,"sec":1,"wid":6,"word":"+","sn":"00000","pro":null,"wform":"","orig":"","exp":"","remark":""},{"id":24217,"engs":"Mark","chap":1,"sec":1,"wid":7,"word":"+","sn":"00000","pro":null,"wform":"","orig":"","exp":"","remark":""},{"id":24217,"engs":"Mark","chap":1,"sec":1,"wid":8,"word":"υἱοῦ","sn":"05207","pro":"名詞","wform":"所有格 單數 陽性   ","orig":"υἱός","exp":"兒子、子孫、子民","remark":"此字在經文中的位置或存在有爭論。"},{"id":24217,"engs":"Mark","chap":1,"sec":1,"wid":9,"word":"θεοῦ","sn":"02316","pro":"名詞","wform":"所有格 單數 陽性   ","orig":"θεός","exp":"上帝","remark":"此字在經文中的位置或存在有爭論。"},{"id":24217,"engs":"Mark","chap":1,"sec":1,"wid":10,"word":"+","sn":"00000","pro":null,"wform":"","orig":"","exp":"","remark":""}],"prev":{"chineses":"太","engs":"Matt","chap":28,"sec":20},"next":{"chineses":"可","engs":"Mark","chap":1,"sec":2}}');
}
/** 可1:4 多行 韋聯 */
function testData3() {
  // tslint:disable-next-line: max-line-length
  return JSON.parse('{"status":"success","record_count":22,"N":0,"record":[{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":0,"word":"ἐγένετο Ἰωάννης + ὁ + (ὁ) + βαπτίζων ἐν τῇ ἐρήμῳ \\n+ + καὶ + κηρύσσων βάπτισμα μετανοίας \\nεἰς ἄφεσιν ἁμαρτιῶν.","exp":"施洗者約翰出現在曠野裡，\\n宣講悔改的洗禮，\\n為了罪惡的赦免。","chineses":"可","chinesef":"馬可福音"},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":1,"word":"ἐγένετο","sn":"01096","pro":"動詞","wform":"第二簡單過去 關身形主動意 直說語氣 第三人稱 單數 ","orig":"γίνομαι","exp":"成為、發生、來","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":2,"word":"Ἰωάννης","sn":"02491","pro":"名詞","wform":"主格 單數 陽性   ","orig":"Ἰωάννης","exp":"專有名詞，人名：約翰","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":3,"word":"+","sn":"00000","pro":null,"wform":"","orig":"","exp":"","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":4,"word":"ὁ","sn":"03588","pro":"冠詞","wform":"主格 單數 陽性   ","orig":"ὁ ἡ τό","exp":"視情況翻譯，有時可譯成「這個」、「那個」等","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":5,"word":"+","sn":"00000","pro":null,"wform":"","orig":"","exp":"","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":6,"word":"ὁ","sn":"03588","pro":"冠詞","wform":"主格 單數 陽性   ","orig":"ὁ ἡ τό","exp":"視情況翻譯，有時可譯成「這個」、「那個」等","remark":"此字在經文中的位置或存在有爭論。"},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":7,"word":"+","sn":"00000","pro":null,"wform":"","orig":"","exp":"","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":8,"word":"βαπτίζων","sn":"00907","pro":"動詞","wform":"現在 主動 分詞 主格 單數 陽性 ","orig":"βαπτίζω","exp":"施洗、清洗","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":9,"word":"ἐν","sn":"01722","pro":"介系詞","wform":"","orig":"ἐν","exp":"後接間接受格，意思是「在...裡面、藉著」","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":10,"word":"τῇ","sn":"03588","pro":"冠詞","wform":"間接受格 單數 陰性   ","orig":"ὁ ἡ τό","exp":"視情況翻譯，有時可譯成「這個」、「那個」等","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":11,"word":"ἐρήμῳ","sn":"02048","pro":"形容詞","wform":"間接受格 單數 陰性   ","orig":"ἔρημος","exp":"荒廢的、無人居住的、名詞：曠野","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":12,"word":"+","sn":"00000","pro":null,"wform":"","orig":"","exp":"","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":13,"word":"+","sn":"00000","pro":null,"wform":"","orig":"","exp":"","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":14,"word":"καὶ","sn":"02532","pro":"連接詞","wform":"","orig":"καί","exp":"並且、然後、和","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":15,"word":"+","sn":"00000","pro":null,"wform":"","orig":"","exp":"","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":16,"word":"κηρύσσων","sn":"02784","pro":"動詞","wform":"現在 主動 分詞 主格 單數 陽性 ","orig":"κηρύσσω","exp":"宣傳、傳道","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":17,"word":"βάπτισμα","sn":"00908","pro":"名詞","wform":"直接受格 單數 中性   ","orig":"βάπτισμα","exp":"洗禮","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":18,"word":"μετανοίας","sn":"03341","pro":"名詞","wform":"所有格 單數 陰性   ","orig":"μετάνοια","exp":"後悔、悔改","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":19,"word":"εἰς","sn":"01519","pro":"介系詞","wform":"","orig":"εἰς","exp":"後接直接受格，意思是「在...、成為、進入...之內、到、為了」","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":20,"word":"ἄφεσιν","sn":"00859","pro":"名詞","wform":"直接受格 單數 陰性   ","orig":"ἄφεσις","exp":"赦免、釋放","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":21,"word":"ἁμαρτιῶν","sn":"00266","pro":"名詞","wform":"所有格 複數 陰性   ","orig":"ἁμαρτία","exp":"罪惡","remark":""}],"prev":{"chineses":"可","engs":"Mark","chap":1,"sec":3},"next":{"chineses":"可","engs":"Mark","chap":1,"sec":5}}');
}
