export class OrigDictResultPreProcess {
  preProcessToInnerHtml(str: string) {
    str = str.replace(/\r*\n/g, '<br />');
    str = str.replace(/\s+(?:SN){0,1}H(\d+)\s*/g, (a1, a2, a3) => {
      // a1: ' H65 ' a2: 65 或 a1: ' SNH65 ' a2: 65
      // sd api, 是 SNH, 所以
      const sn = parseInt(a2, 10);
      return ` <span class="sn-or-ref" sn=${sn} isOld="1">H${sn}</span> `;
      // return ` <span class="sn-or-ref" sn=${sn} isOld="1">&lt;H${sn}&gt;</span> `;
    });
    str = str.replace(/\s+G(\d+)\s*/g, (a1, a2, a3) => {
      // a1: ' H65 ' a2: '65'
      return ` <span class="sn-or-ref" sn=${a2} isOld="0">G${a2}</span> `;
      // return ` <span class="sn-or-ref" sn=${a3} isOld="0">&lt;G${a2}&gt;</span> `;
    });
    str = str.replace(/#([^\|]+)\|/g, (a1, a2, a3) => {
      // 重點1, #不是跳脫字元, |是.
      // 重點2, 與H98 G98不一樣, #不一定前面有空白
      return ` <span class="sn-or-ref" desc="${a2}" isOld="0">${a1}</span> `;
    });
    return str;
  }
}
