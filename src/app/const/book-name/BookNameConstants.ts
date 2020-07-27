
export class BookNameConstants {
  /** @const {string[]} '創', '出', '利'... */
  static readonly CHINESE_BOOK_ABBREVIATIONS = [
    '創', '出', '利', '民', '申',
    '書', '士', '得', '撒上', '撒下', '王上', '王下', '代上', '代下', '拉', '尼', '斯',
    '伯', '詩', '箴', '傳', '歌',
    '賽', '耶', '哀', '結', '但',
    '何', '珥', '摩', '俄', '拿', '彌', '鴻', '哈', '番', '該', '亞', '瑪',
    '太', '可', '路', '約',
    '徒',
    '羅', '林前', '林後', '加', '弗', '腓', '西', '帖前', '帖後', '提前', '提後', '多', '門',
    '來', '雅', '彼前', '彼後', '約一', '約二', '約三', '猶',
    '啟'
  ];

  /** @const {string[]} '创', '出', '利',... */

  static readonly CHINESE_BOOK_ABBREVIATIONS_GB = [
    '创', '出', '利', '民', '申',
    '书', '士', '得', '撒上', '撒下', '王上', '王下', '代上', '代下', '拉', '尼', '斯',
    '伯', '诗', '箴', '传', '歌',
    '赛', '耶', '哀', '结', '但',
    '何', '珥', '摩', '俄', '拿', '弥', '鸿', '哈', '番', '该', '亚', '玛',
    '太', '可', '路', '约',
    '徒',
    '罗', '林前', '林后', '加', '弗', '腓', '西', '帖前', '帖後', '提前', '提後', '多', '门',
    '来', '雅', '彼前', '彼后', '约一', '约二', '约三', '犹',
    '启'
  ];
  /** @const {string[]} '創世記', '出埃及記', '利未記', ,... */
  static readonly CHINESE_BOOK_NAMES = [
    '創世記', '出埃及記', '利未記', '民數記', '申命記',
    '約書亞記', '士師記', '路得記', '撒母耳記上', '撒母耳記下', '列王紀上', '列王紀下', '歷代志上', '歷代志下', '以斯拉記', '尼希米記', '以斯帖記',
    '約伯記', '詩篇', '箴言', '傳道書', '雅歌',
    '以賽亞書', '耶利米書', '耶利米哀歌', '以西結書', '但以理書',
    '何西阿書', '約珥書', '阿摩司書', '俄巴底亞書', '約拿書', '彌迦書', '那鴻書', '哈巴谷書', '西番雅書', '哈該書', '撒迦利亞書', '瑪拉基書',
    '馬太福音', '馬可福音', '路加福音', '約翰福音',
    '使徒行傳',
    '羅馬書', '哥林多前書', '哥林多後書', '加拉太書', '以弗所書', '腓立比書', '歌羅西書',
    '帖撒羅尼迦前書', '帖撒羅尼迦後書', '提摩太前書', '提摩太後書', '提多書', '腓利門書',
    '希伯來書', '雅各書', '彼得前書', '彼得後書', '約翰壹書', '約翰貳書', '約翰參書', '猶大書',
    '啟示錄'
  ];
  /** @const {string[]} '创世记', '出埃及记', '利未记',... */
  static readonly CHINESE_BOOK_NAMES_GB = [
    '创世记', '出埃及记', '利未记', '民数记', '申命记',
    '约书亚记', '士师记', '路得记', '撒母耳记上', '撒母耳记下', '列王纪上', '列王纪下', '历代志上', '历代志下', '以斯拉记', '尼希米记', '以斯帖记',
    '约伯记', '诗篇', '箴言', '传道书', '雅歌',
    '以赛亚书', '耶利米书', '耶利米哀歌', '以西结书', '但以理书',
    '何西阿书', '约珥书', '阿摩司书', '俄巴底亚书', '约拿书', '弥迦书', '那鸿书', '哈巴谷书', '西番雅书', '哈该书', '撒迦利亚书', '玛拉基书',
    '马太福音', '马可福音', '路加福音', '约翰福音',
    '使徒行传',
    '罗马书', '哥林多前书', '哥林多後书', '加拉太书', '以弗所书', '腓立比书', '歌罗西书',
    '帖撒罗尼迦前书', '帖撒罗尼迦後书', '提摩太前书', '提摩太後书', '提多书', '腓利门书',
    '希伯来书', '雅各书', '彼得前书', '彼得後书', '约翰壹书', '约翰贰书', '约翰参书', '犹大书',
    '启示录'
  ];


  /** @const {string[]} 'Gen', 'Ex', 'Lev', 'Num'... */


  static readonly ENGLISH_BOOK_ABBREVIATIONS = [
    'Gen', 'Ex', 'Lev', 'Num', 'Deut',
    'Josh', 'Judg', 'Ruth', '1 Sam', '2 Sam',
    '1 Kin', '2 Kin', '1 Chr', '2 Chr', 'Ezra', 'Neh', 'Esth',
    'Job', 'Ps', 'Prov', 'Eccl', 'Song',
    'Is', 'Jer', 'Lam', 'Ezek', 'Dan',
    'Hos', 'Joel', 'Amos', 'Obad', 'Jon', 'Mic', 'Nah', 'Hab', 'Zeph', 'Hag', 'Zech', 'Mal',
    'Matt', 'Mark', 'Luke', 'John',
    'Acts',
    'Rom', '1 Cor', '2 Cor', 'Gal', 'Eph', 'Phil', 'Col',
    '1 Thess', '2 Thess', '1 Tim', '2 Tim', 'Titus', 'Philem',
    'Heb', 'James', '1 Pet', '2 Pet', '1 John', '2 John', '3 John', 'Jude',
    'Rev'
  ];
  /** @const {string[]} 'Genesis', 'Exodus', 'Leviticus', ... */
  static readonly ENGLISH_BOOK_NAMES = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', 'First Samuel', 'Second Samuel',
    'First Kings', 'Second Kings', 'First Chronicles', 'Second Chronicles', 'Ezra', 'Nehemiah', 'Esther',
    'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
    'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
    'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
    'Matthew', 'Mark', 'Luke', 'John',
    'Acts',
    'Romans', 'First Corinthians', 'Second Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians',
    'First Thessalonians', 'Second Thessalonians', 'First Timothy', 'Second Timothy', 'Titus', 'Philemon',
    'Hebrews', 'James', 'First Peter', 'Second Peter', 'First John', 'second John', 'Third John', 'Jude',
    'Revelation'
  ];
  /** @const {string[]} 'Ge', 'Ex', 'Le',... */
  static readonly ENGLISH_BOOK_SHORT_ABBREVIATIONS = [
    'Ge', 'Ex', 'Le', 'Nu', 'De',
    'Jos', 'Jud', 'Ru', '1Sa', '2Sa',
    '1Ki', '2Ki', '1Ch', '2Ch', 'Ezr', 'Ne', 'Es',
    'Job', 'Ps', 'Pr', 'Ec', 'So', 'Isa', 'Jer', 'La', 'Eze', 'Da',
    'Ho', 'Joe', 'Am', 'Ob', 'Jon', 'Mic', 'Na', 'Hab', 'Zep', 'Hag', 'Zec', 'Mal',
    'Mt', 'Mr', 'Lu', 'Joh',
    'Ac',
    'Ro', '1Co', '2Co', 'Ga', 'Eph', 'Php', 'Col',
    '1Th', '2Th', '1Ti', '2Ti', 'Tit', 'Phm',
    'Heb', 'Jas', '1Pe', '2Pe', '1Jo', '2Jo', '3Jo', 'Jude',
    'Re'
  ];
}

