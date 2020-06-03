export class BibleTextWithSnResultPreProcess {
  preProcessToInnerHtml(str: string) {
    str = str.replace(/<(WTH|WAH|WH)(\d+)>/gi, (a1, a2, a3) => {
      // <WTH8804> (H8804) class sn old wth
      // <WH1254> <H1254> class sn old wh
      // <WAH9002> <H9002> class sn old wah
      const sn = parseInt(a3, 10);
      const rr1 = (a2 === 'WTH') ? `(H${sn})` : `&lt;H${sn}&gt;`;
      return ` <span class="sn old ${a2}" sn="${sn}" isOld="1">${rr1}</span>`;
    });
    str = str.replace(/<(WTG|WG)(\d+)>/gi, (a1, a2, a3) => {
      const sn = parseInt(a3, 10);
      const rr1 = (a2 === 'WTG') ? `(G${sn})` : `&lt;G${sn}&gt;`;
      return ` <span class="sn new ${a2}" sn="${sn}">${rr1}</span>`;
    });
    return str;
  }
}
