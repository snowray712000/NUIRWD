import { DQbResult } from 'src/app/fhl-api/ApiQb';
export class GetExpsFromQbResult {
  main(arg: DQbResult): { w: string }[][] {
    const r1 = arg.record[0].exp.replace('\r', ''); // 換行一致用 \n 就好,
    const r2 = r1.split('\n');
    // console.log(JSON.stringify(r2));
    // ["施洗者約翰出現在曠野裡，","宣講悔改的洗禮，","為了罪惡的赦免。"]

    // 雖然這樣看起來很蠢，但以後可能可以有切開中文的技術。
    const r3 = r2.map(a1 => [{ w: a1 }]);
    return r3;
  }
}
