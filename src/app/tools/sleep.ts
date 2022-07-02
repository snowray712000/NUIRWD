/** 會造成凍結 */
export function sleep(milliseconds: number) {
  const start = new Date().getTime();
  while (1) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}

/**
 * 用 setTimeout 與 Promise 實作 await 版的 sleep
 * @param time ms
 * @returns 
 */
export async function sleepAsync(time: number): Promise<void> {
  return new Promise<void>((res, rej) => {
    setTimeout(res, time);
  });
}