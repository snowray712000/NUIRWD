/** <aaa class=oooooo>ccc</aaa> 可取出 aaa, ccc, class=ooooo */
export class RegexHtmlTag {
  /** [1], div [2] tag屬性 [3] 文字內容 */
  static regHtml = /<(\w+)([^>]*)>(.*?)<\/\1>/g;
}
