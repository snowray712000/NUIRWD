import { assert } from 'src/app/tools/assert';
export function matchGlobalWithCapture(reg: RegExp, str: string): RegExpExecArray[] {
  assert(() => reg.global, '若非global會無窮迴圈');
  const re: RegExpExecArray[] = [];
  let r1: RegExpExecArray;
  // tslint:disable-next-line: no-conditional-assignment
  while ((r1 = reg.exec(str)) !== null) {
    re.push(r1);
  }
  reg.lastIndex = 0 ; // 用完, 還原最初狀態 (最初是0,不是-1)
  return re;
}
