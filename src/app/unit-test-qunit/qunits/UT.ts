import * as LQ from 'linq';
import { DUTFn, DUTClass } from './qunits.component';
/** UT unit test */
export class UT {
  static groups: { fn: () => Promise<DUTFn[]>; }[] = [];
  static add(fn: () => Promise<DUTFn[]>) {
    UT.groups.push({ fn });
  }
  /** 在 qunits 呼叫 */
  static async testAsync(): Promise<DUTClass[]> {
    const groups = UT.groups;

    const reTest = await Promise.all(LQ.from(groups).select(a1 => a1.fn()).toArray());
    const re: DUTClass[] = [];
    groups.forEach((a1, i1) => {
      re.push({ na: getFuntionName(a1.fn), fns: reTest[i1] });
    });
    return re;
    // test_MyAAa 得到 MyAAa ; testMyAAa 得到 MyAAa ; MyAAa 得到 MyAAa
    function getFuntionName(fn: () => Promise<DUTFn[]>) {
      const na = fn.name;
      const reExec = /(?:test_?)?(\w+)/i.exec(na);
      return reExec == null ? fn.name : reExec[1];
    }
  }

  static equal(na: string, exp, act, msg?: string): DUTFn {
    const rr1 = JSON.stringify(exp);
    const rr2 = JSON.stringify(act);
    if (rr1.localeCompare(rr2) === 0) {
      return { na, st: 1, msg };
    }
    return { na, st: 0, msg, expect: rr1, actual: rr2 };
  }
  /**
   * gFnSafe g:generate Fn function Safe: try catch 存在
   */
  static gFnSafe(fnDo: (re: DUTFn[]) => void, na?: string) {
    const fns: DUTFn[] = [];
    try {
      fnDo(fns);
    } catch (error) {
      console.error(error);
      fns.push({ na, st: 0, error });
    }
    return fns;
  }
  private info() {
    // 開發後, 變成5行.
    // UT.add(test_newLineNewLineSplit);
    // UT.add(test_mergeTextAtCommentText);
    // UT.add(test_prepareDataForAddOrderAndListAtComment);
    // UT.add(test_addListStartAndEndUnitTests);
    // UT.testAsync().then(re => this.datas = re);
    // 沒開發前, 要寫這些, (以下)
    // Promise.all([
    //   test_newLineNewLineSplit(),
    //   test_mergeTextAtCommentText(),
    //   test_prepareDataForAddOrderAndListAtComment(),
    //   test_addListStartAndEndUnitTests(),
    // ]
    // ).then(a1 => {
    //   const re: DUTClass[] = [];
    //   re.push({ na: 'newLineNewLineSplit', fns: a1[0] });
    //   re.push({ na: 'mergeTextAtCommentText', fns: a1[1] });
    //   re.push({ na: 'prepareDataForAddOrderAndListAtComment', fns: a1[2] });
    //   re.push({ na: 'addListStartAndEndUnitTests', fns: a1[3] });
    //   this.datas = re;
    // });
  }
}
