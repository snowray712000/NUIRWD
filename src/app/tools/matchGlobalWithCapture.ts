import { assert } from 'src/app/tools/assert';
export function matchGlobalWithCapture(reg: RegExp, str: string): RegExpExecArray[] {
  assert(() => reg.global, '若非global會無窮迴圈');
  const re: RegExpExecArray[] = [];
  let r1: RegExpExecArray;
  // tslint:disable-next-line: no-conditional-assignment
  while ((r1 = reg.exec(str)) !== null) {
    re.push(r1);
  }
  return re;
}
