import { Observable, of } from 'rxjs';
import { DApiSdResult } from "./DApiSdResult";
export class ApiSbdagPersudo {
  queryQsbAsync(arg: {
    sn: number;
    isOldTestment?: boolean;
    isSimpleChinese?: boolean;
  }): Observable<DApiSdResult> {
    return of(this.g11());
  }
  private g11() {
    // tslint:disable-next-line: max-line-length
    const re = '{"status":"success","record_count":1,"record":[{"sn":"00011","dic_text":"Ἀβραάμ, ὁ 人名　無變格\\r\\n（אַבְרָהָם H85「<span class=\\"exp\\">多人之父</span>」）「<span class=\\"exp\\">亞伯拉罕</span>」。出現於耶穌的家譜中，#太1:1,2,17;路3:34|。是以色列民族的父，亦為基督徒這真以色列人的父，#太3:9;路1:73;3:8;約8:39,53,56;徒7:2;羅4:1;雅2:21|。因此，以色列百姓稱為亞伯拉罕的後裔，#約8:33,37;羅9:7;11:1;林後11:22;加3:29;來2:16|。是得蒙應許者，#徒3:25;7:17;羅4:13;加3:8,14,16,18;來6:13|。滿有信心，#羅4:3|（#創15:6|）#羅4:9,12,16;加3:6|（#創15:6|）,#加3:9;雅2:23|。此處並稱之為神的朋友（參#賽41:8;代下20:7;但3:35|;參#出33:11|）;在來世具有顯赫地位，#路16:22|以下（見 κόλπος G2859一），以撒、雅各和眾先知亦同，#路13:28|。神被描述為亞伯拉罕、以撒、雅各的神（#出3:6|）#太22:32;可12:26;路20:37;徒3:13;7:32|。他與以撒、雅各一同在神國中坐席，#太8:11|。"}]}';
    const re2 = JSON.parse(re);
    return re2;
  }
}
