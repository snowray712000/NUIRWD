

/**
 * 只要 include ijnjs.js 馬上就能用了，會定義到 window
 * 但 ijnjs 則是 async 的
 * 你可以使用 testThenDo().then(...)
 * @param {{cbTest:()=>boolean;ms?:number;msg?:string;cntMax?:number}} args 
 */
declare function testThenDo(arg: { cbTest: () => boolean; ms?: number; msg?: string; cntMax?: number }): void

/**
 * @param {{cbTest:()=>boolean;ms?:number;msg?:string;cntMax?:number}} args 
 * @returns {Promise<any>}
 */
declare function testThenDoAsync(args: { cbTest: () => boolean; ms?: number; msg?: string; cntMax?: number }): Promise<any>

