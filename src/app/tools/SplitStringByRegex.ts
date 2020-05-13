import { matchGlobalWithCapture } from 'src/app/tools/matchGlobalWithCapture';
export class SplitStringByRegex {
  main(str: string, reg: RegExp): {
    data: string[];
    isStartFromFirstChar: boolean;
  } {
    const r1 = matchGlobalWithCapture(reg, str);
    let isStartFromFirstChar = true;
    const data: string[] = [];
    if (r1.length === 0) {
      data.push(str);
    } else {
      if (r1[0].index > 0) {
        data.push(str.substr(0, r1[0].index));
        isStartFromFirstChar = false;
      }
      for (let i = 0; i < r1.length; i++) {
        const it = r1[i];
        const len = it[0].length;
        data.push(it[0]);
        if (i !== r1.length - 1) {
          data.push(str.substr(it.index + len, r1[i + 1].index - it.index - len));
        }
        else {
          data.push(str.substr(it.index + len, str.length - it.index - len));
        }
      }
    }
    return {
      data,
      isStartFromFirstChar,
    };
  }
}
