import { IBookNameToId } from './i-book-name-to-id';
import { range_linq } from '../../linq-like/Range_linq';
import { BibleBookNames } from './BibleBookNames';
import { BookNameLang } from './BookNameLang';
import { BookNameAndId } from './BookNameAndId';

export class BookNameToId implements IBookNameToId {
  private static regNa: RegExp;
  cvtName2Id(na: string): number {
    if (BookNameToId.regNa === undefined) {
      const reg = this.generateMapAndRegex();
      BookNameToId.regNa = reg;
    }

    const r1 = na.match(BookNameToId.regNa);
    // console.log(r5);
    // ["太", "太", index: 0, input: "太", groups: undefined]
    if (r1 === undefined) {
      return undefined;
    }
    return new BookNameAndId().getIdOrUndefined(r1[1].toLowerCase());
  }

  private generateMapAndRegex(): RegExp {
    const names = new BookNameAndId().getNamesOrderByNameLength(); // mt 若剛好有個也是 mt 開頭會被誤會,所以長的在前面
    // console.log(JSON.stringify(names));
    // tslint:disable-next-line: max-line-length
    // ["second thessalonians","first thessalonians","second corinthians","second chronicles","first corinthians","first chronicles","song of solomon","second timothy","second samuel","first timothy","first samuel","second kings","ecclesiastes","lamentations","second peter","deuteronomy","first kings","philippians","first peter","second john","colossians","first john","third john","revelation","leviticus","zephaniah","zechariah","galatians","ephesians","nehemiah","proverbs","jeremiah","habakkuk","philemon","帖撒羅尼迦前書","帖撒羅尼迦後書","genesis","numbers","ezekiel","obadiah","malachi","matthew","hebrews","1 thess","2 thess","exodus","joshua","judges","esther","psalms","isaiah","daniel","haggai","romans","philem","1 john","2 john","3 john","撒母耳記上","撒母耳記下","耶利米哀歌","俄巴底亞書","撒迦利亞書","哥林多前書","哥林多後書","提摩太前書","提摩太後書","hosea","jonah","micah","nahum","titus","james","1 sam","2 sam","1 kin","2 kin","1 chr","2 chr","1 cor","2 cor","1 tim","2 tim","1 pet","2 pet","出埃及記","約書亞記","列王紀上","列王紀下","歷代志上","歷代志下","以斯拉記","尼希米記","以斯帖記","以賽亞書","耶利米書","以西結書","但以理書","何西阿書","阿摩司書","哈巴谷書","西番雅書","瑪拉基書","馬太福音","馬可福音","路加福音","約翰福音","使徒行傳","加拉太書","以弗所書","腓立比書","歌羅西書","腓利門書","希伯來書","彼得前書","彼得後書","約翰一書","約翰二書","約翰三書","ruth","ezra","joel","amos","mark","luke","john","acts","jude","deut","josh","judg","esth","prov","eccl","song","ezek","obad","zeph","zech","matt","phil","約翰壹書","約翰貳書","約翰參書","創世記","利未記","民數記","申命記","士師記","路得記","約伯記","傳道書","約珥書","約拿書","彌迦書","那鴻書","哈該書","羅馬書","提多書","雅各書","猶大書","啟示錄","job","gen","lev","num","neh","jer","lam","dan","hos","jon","mic","nah","hab","hag","mal","rom","gal","eph","col","heb","rev","jos","jud","1sa","2sa","1ki","2ki","1ch","2ch","ezr","isa","eze","joe","zep","zec","joh","1co","2co","php","1th","2th","1ti","2ti","tit","phm","jas","1pe","2pe","1jo","2jo","3jo","詩篇","箴言","雅歌","ex","ps","is","撒上","撒下","王上","王下","代上","代下","林前","林後","帖前","帖後","提前","提後","彼前","彼後","約一","約二","約三","ge","le","nu","de","ru","ne","es","pr","ec","so","la","da","ho","am","ob","na","mt","mr","lu","ac","ro","ga","re","約壹","約貳","約參","創","出","利","民","申","書","士","得","拉","尼","斯","伯","詩","箴","傳","歌","賽","耶","哀","結","但","何","珥","摩","俄","拿","彌","鴻","哈","番","該","亞","瑪","太","可","路","約","徒","羅","加","弗","腓","西","多","門","來","雅","猶","啟"]
    // (瑪|太){0,1}(\\s*)([0-9:\\-,]+) // 把最後的 + 改為 *, 因為 '約二' 的 case
    const r3 = '(' + names.join('|') + ')';
    // console.log(r3);
    // tslint:disable-next-line: max-line-length
    // (second thessalonians|first thessalonians|second corinthians|second chronicles|first corinthians|first chronicles|song of solomon|second timothy|second samuel|first timothy|first samuel|second kings|ecclesiastes|lamentations|second peter|deuteronomy|first kings|philippians|first peter|second john|colossians|first john|third john|revelation|leviticus|zephaniah|zechariah|galatians|ephesians|nehemiah|proverbs|jeremiah|habakkuk|philemon|帖撒羅尼迦前書|帖撒羅尼迦後書|genesis|numbers|ezekiel|obadiah|malachi|matthew|hebrews|1 thess|2 thess|exodus|joshua|judges|esther|psalms|isaiah|daniel|haggai|romans|philem|1 john|2 john|3 john|撒母耳記上|撒母耳記下|耶利米哀歌|俄巴底亞書|撒迦利亞書|哥林多前書|哥林多後書|提摩太前書|提摩太後書|hosea|jonah|micah|nahum|titus|james|1 sam|2 sam|1 kin|2 kin|1 chr|2 chr|1 cor|2 cor|1 tim|2 tim|1 pet|2 pet|出埃及記|約書亞記|列王紀上|列王紀下|歷代志上|歷代志下|以斯拉記|尼希米記|以斯帖記|以賽亞書|耶利米書|以西結書|但以理書|何西阿書|阿摩司書|哈巴谷書|西番雅書|瑪拉基書|馬太福音|馬可福音|路加福音|約翰福音|使徒行傳|加拉太書|以弗所書|腓立比書|歌羅西書|腓利門書|希伯來書|彼得前書|彼得後書|約翰一書|約翰二書|約翰三書|ruth|ezra|joel|amos|mark|luke|john|acts|jude|deut|josh|judg|esth|prov|eccl|song|ezek|obad|zeph|zech|matt|phil|約翰壹書|約翰貳書|約翰參書|創世記|利未記|民數記|申命記|士師記|路得記|約伯記|傳道書|約珥書|約拿書|彌迦書|那鴻書|哈該書|羅馬書|提多書|雅各書|猶大書|啟示錄|job|gen|lev|num|neh|jer|lam|dan|hos|jon|mic|nah|hab|hag|mal|rom|gal|eph|col|heb|rev|jos|jud|1sa|2sa|1ki|2ki|1ch|2ch|ezr|isa|eze|joe|zep|zec|joh|1co|2co|php|1th|2th|1ti|2ti|tit|phm|jas|1pe|2pe|1jo|2jo|3jo|詩篇|箴言|雅歌|ex|ps|is|撒上|撒下|王上|王下|代上|代下|林前|林後|帖前|帖後|提前|提後|彼前|彼後|約一|約二|約三|ge|le|nu|de|ru|ne|es|pr|ec|so|la|da|ho|am|ob|na|mt|mr|lu|ac|ro|ga|re|約壹|約貳|約參|創|出|利|民|申|書|士|得|拉|尼|斯|伯|詩|箴|傳|歌|賽|耶|哀|結|但|何|珥|摩|俄|拿|彌|鴻|哈|番|該|亞|瑪|太|可|路|約|徒|羅|加|弗|腓|西|多|門|來|雅|猶|啟)
    const reg = new RegExp(r3, 'i');
    return reg;
  }
}
