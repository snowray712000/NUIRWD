export function setTimeoutTrySleepTry(fnIsRetry: () => boolean, fnDoWhenReady: () => void, timeSleepMs = 100) {
  let htimeout;
  const fn1 = () => {
    if (htimeout !== undefined) {
      clearTimeout(htimeout);
    }

    htimeout = setTimeout(() => {
      if (fnIsRetry()) {
        fn1();
      } else {
        fnDoWhenReady();
      }
    }, timeSleepMs);
  };

  fn1();
}
