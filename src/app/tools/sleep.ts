/** 會造成凍結 */
export function sleep(milliseconds: number) {
  const start = new Date().getTime();
  while (1) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}
