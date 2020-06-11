import { BookNameLang } from './BookNameLang';
import { linq_range } from '../../linq-like/linq_range';

export class BibleBookNames {
  // [0]=["Gen", "Genesis", "創", "創世記", "Ge"]
  private static constNames: Map<number, Array<string>>;
  constructor() {
    // console.log(this.getBibleName(1));
  }
  public static getBookName(idBook1based: number, lang: BookNameLang) {
    return BibleBookNames.getBibleName(idBook1based, BookNameLang[BookNameLang[lang]]);
  }
  public static getBookNames(lang: BookNameLang) {
    this.makeSureBibleBookNamesExist();
    const r1 = BookNameLang[BookNameLang[lang]];
    return linq_range(1, 66).map(a1 => this.constNames.get(a1)[r1]);
  }

  private static makeSureBibleBookNamesExist(): void {
    if (BibleBookNames.constNames === undefined) {
      const results = new Map<number, Array<string>>();
      // tslint:disable-next-line: max-line-length
      const r1 = '0,Abs.,Abstract,引言,引言,Abs.;1,Gen,Genesis,創,創世記,Ge;2,Ex,Exodus,出,出埃及記,Ex;3,Lev,Leviticus,利,利未記,Le;4,Num,Numbers,民,民數記,Nu;5,Deut,Deuteronomy,申,申命記,De;6,Josh,Joshua,書,約書亞記,Jos;7,Judg,Judges,士,士師記,Jud;8,Ruth,Ruth,得,路得記,Ru;9,1 Sam,First Samuel,撒上,撒母耳記上,1Sa;10,2 Sam,Second Samuel,撒下,撒母耳記下,2Sa;11,1 Kin,First Kings,王上,列王紀上,1Ki;12,2 Kin,Second Kings,王下,列王紀下,2Ki;13,1 Chr,First Chronicles,代上,歷代志上,1Ch;14,2 Chr,Second Chronicles,代下,歷代志下,2Ch;15,Ezra,Ezra,拉,以斯拉記,Ezr;16,Neh,Nehemiah,尼,尼希米記,Ne;17,Esth,Esther,斯,以斯帖記,Es;18,Job,Job,伯,約伯記,Job;19,Ps,Psalms,詩,詩篇,Ps;20,Prov,Proverbs,箴,箴言,Pr;21,Eccl,Ecclesiastes,傳,傳道書,Ec;22,Song,Song of Solomon,歌,雅歌,So;23,Is,Isaiah,賽,以賽亞書,Isa;24,Jer,Jeremiah,耶,耶利米書,Jer;25,Lam,Lamentations,哀,耶利米哀歌,La;26,Ezek,Ezekiel,結,以西結書,Eze;27,Dan,Daniel,但,但以理書,Da;28,Hos,Hosea,何,何西阿書,Ho;29,Joel,Joel,珥,約珥書,Joe;30,Amos,Amos,摩,阿摩司書,Am;31,Obad,Obadiah,俄,俄巴底亞書,Ob;32,Jon,Jonah,拿,約拿書,Jon;33,Mic,Micah,彌,彌迦書,Mic;34,Nah,Nahum,鴻,那鴻書,Na;35,Hab,Habakkuk,哈,哈巴谷書,Hab;36,Zeph,Zephaniah,番,西番雅書,Zep;37,Hag,Haggai,該,哈該書,Hag;38,Zech,Zechariah,亞,撒迦利亞書,Zec;39,Mal,Malachi,瑪,瑪拉基書,Mal;40,Matt,Matthew,太,馬太福音,Mt;41,Mark,Mark,可,馬可福音,Mr;42,Luke,Luke,路,路加福音,Lu;43,John,John,約,約翰福音,Joh;44,Acts,Acts,徒,使徒行傳,Ac;45,Rom,Romans,羅,羅馬書,Ro;46,1 Cor,First Corinthians,林前,哥林多前書,1Co;47,2 Cor,Second Corinthians,林後,哥林多後書,2Co;48,Gal,Galatians,加,加拉太書,Ga;49,Eph,Ephesians,弗,以弗所書,Eph;50,Phil,Philippians,腓,腓立比書,Php;51,Col,Colossians,西,歌羅西書,Col;52,1 Thess,First Thessalonians,帖前,帖撒羅尼迦前書,1Th;53,2 Thess,Second Thessalonians,帖後,帖撒羅尼迦後書,2Th;54,1 Tim,First Timothy,提前,提摩太前書,1Ti;55,2 Tim,Second Timothy,提後,提摩太後書,2Ti;56,Titus,Titus,多,提多書,Tit;57,Philem,Philemon,門,腓利門書,Phm;58,Heb,Hebrews,來,希伯來書,Heb;59,James,James,雅,雅各書,Jas;60,1 Pet,First Peter,彼前,彼得前書,1Pe;61,2 Pet,Second Peter,彼後,彼得後書,2Pe;62,1 John,First John,約一,約翰一書,1Jo;63,2 John,second John,約二,約翰二書,2Jo;64,3 John,Third John,約三,約翰三書,3Jo;65,Jude,Jude,猶,猶大書,Jude;66,Rev,Revelation,啟,啟示錄,Re';
      const r2 = r1.split(';');
      r2.forEach(a1 => {
        const r3 = a1.split(',');
        const idBook = parseInt(r3[0], 10);
        const otherUsers = r3.filter((u, i) => i >= 1); // r3.skip(n) 的概念
        results.set(idBook, otherUsers);
      });
      BibleBookNames.constNames = results;
    }
  }
  private static getBibleName(book: number, flag0Based = 2): string {
    BibleBookNames.makeSureBibleBookNamesExist();

    const map1 = BibleBookNames.constNames;
    if (map1.has(book) === false) {
      throw new Error(`Error Book ${book}.`);
    }

    const r1 = BibleBookNames.constNames.get(book);
    if (r1.length <= flag0Based) {
      throw new Error(`Error Book flag ${flag0Based}`);
    }

    return r1[flag0Based];
  }
}
