
/** console.error 且 throw new Error */
export function assert(fn: () => boolean, msg?: string) {
  if (fn() === false) {
    const msg2 = 'assert ' + msg !== undefined ? '' : msg;
    console.error(msg2);
    throw new Error(msg2);
  }
}
