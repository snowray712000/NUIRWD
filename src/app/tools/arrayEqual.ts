/** 開發給 ngOnChanges 用的, [0] === [1,0] ?
 *  但因為 SimpleChanges 參數不能是 number[], 所以要把型態拿掉
 */
export function isArrayEqual(ar1: Array<any>, ar2: Array<any>) {
  if (isArrayEqualLength(ar1, ar2) === false) {
    return false;
  }

  for (let index = 0; index < ar1.length; index++) {
    if (ar1[index] !== ar2[index]) {
      return false;
    }
  }
  return true;
}
/**
 * 開發給 ngOnChanges 用的, 在 長度一樣的時候, 不用去作 「需要RWD」判斷嗎
 */
export function isArrayEqualLength(ar1: Array<any>, ar2: Array<any>) {
  if (ar1 === undefined) {
    if (ar2 === undefined) {
      return true;
    }
    return false;
  }
  if (ar2 === undefined) {
    return false;
  }
  if (ar1.length !== ar2.length) {
    return false;
  }
  return true;
}

