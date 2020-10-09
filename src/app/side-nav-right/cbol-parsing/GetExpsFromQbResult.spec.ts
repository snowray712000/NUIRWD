import { GetExpsFromQbResult } from "./GetExpsFromQbResult";
import { assert } from 'src/app/tools/assert';

describe(
  'GetExpsFromQbResult', () => {
    it('可1:4', () => {
      const r1 = testData3();
      // console.log(r1);
      const r2 = new GetExpsFromQbResult().main(r1);
      expect(r2.length).toBe(3);
    });
  }
);

/** 可1:4 多行 韋聯 */
function testData3() {
  // tslint:disable-next-line: max-line-length
  return JSON.parse('{"status":"success","record_count":22,"N":0,"record":[{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":0,"word":"ἐγένετο Ἰωάννης + ὁ + (ὁ) + βαπτίζων ἐν τῇ ἐρήμῳ \\n+ + καὶ + κηρύσσων βάπτισμα μετανοίας \\nεἰς ἄφεσιν ἁμαρτιῶν.","exp":"施洗者約翰出現在曠野裡，\\n宣講悔改的洗禮，\\n為了罪惡的赦免。","chineses":"可","chinesef":"馬可福音"},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":1,"word":"ἐγένετο","sn":"01096","pro":"動詞","wform":"第二簡單過去 關身形主動意 直說語氣 第三人稱 單數 ","orig":"γίνομαι","exp":"成為、發生、來","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":2,"word":"Ἰωάννης","sn":"02491","pro":"名詞","wform":"主格 單數 陽性   ","orig":"Ἰωάννης","exp":"專有名詞，人名：約翰","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":3,"word":"+","sn":"00000","pro":null,"wform":"","orig":"","exp":"","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":4,"word":"ὁ","sn":"03588","pro":"冠詞","wform":"主格 單數 陽性   ","orig":"ὁ ἡ τό","exp":"視情況翻譯，有時可譯成「這個」、「那個」等","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":5,"word":"+","sn":"00000","pro":null,"wform":"","orig":"","exp":"","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":6,"word":"ὁ","sn":"03588","pro":"冠詞","wform":"主格 單數 陽性   ","orig":"ὁ ἡ τό","exp":"視情況翻譯，有時可譯成「這個」、「那個」等","remark":"此字在經文中的位置或存在有爭論。"},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":7,"word":"+","sn":"00000","pro":null,"wform":"","orig":"","exp":"","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":8,"word":"βαπτίζων","sn":"00907","pro":"動詞","wform":"現在 主動 分詞 主格 單數 陽性 ","orig":"βαπτίζω","exp":"施洗、清洗","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":9,"word":"ἐν","sn":"01722","pro":"介系詞","wform":"","orig":"ἐν","exp":"後接間接受格，意思是「在...裡面、藉著」","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":10,"word":"τῇ","sn":"03588","pro":"冠詞","wform":"間接受格 單數 陰性   ","orig":"ὁ ἡ τό","exp":"視情況翻譯，有時可譯成「這個」、「那個」等","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":11,"word":"ἐρήμῳ","sn":"02048","pro":"形容詞","wform":"間接受格 單數 陰性   ","orig":"ἔρημος","exp":"荒廢的、無人居住的、名詞：曠野","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":12,"word":"+","sn":"00000","pro":null,"wform":"","orig":"","exp":"","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":13,"word":"+","sn":"00000","pro":null,"wform":"","orig":"","exp":"","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":14,"word":"καὶ","sn":"02532","pro":"連接詞","wform":"","orig":"καί","exp":"並且、然後、和","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":15,"word":"+","sn":"00000","pro":null,"wform":"","orig":"","exp":"","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":16,"word":"κηρύσσων","sn":"02784","pro":"動詞","wform":"現在 主動 分詞 主格 單數 陽性 ","orig":"κηρύσσω","exp":"宣傳、傳道","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":17,"word":"βάπτισμα","sn":"00908","pro":"名詞","wform":"直接受格 單數 中性   ","orig":"βάπτισμα","exp":"洗禮","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":18,"word":"μετανοίας","sn":"03341","pro":"名詞","wform":"所有格 單數 陰性   ","orig":"μετάνοια","exp":"後悔、悔改","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":19,"word":"εἰς","sn":"01519","pro":"介系詞","wform":"","orig":"εἰς","exp":"後接直接受格，意思是「在...、成為、進入...之內、到、為了」","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":20,"word":"ἄφεσιν","sn":"00859","pro":"名詞","wform":"直接受格 單數 陰性   ","orig":"ἄφεσις","exp":"赦免、釋放","remark":""},{"id":24220,"engs":"Mark","chap":1,"sec":4,"wid":21,"word":"ἁμαρτιῶν","sn":"00266","pro":"名詞","wform":"所有格 複數 陰性   ","orig":"ἁμαρτία","exp":"罪惡","remark":""}],"prev":{"chineses":"可","engs":"Mark","chap":1,"sec":3},"next":{"chineses":"可","engs":"Mark","chap":1,"sec":5}}');
}
