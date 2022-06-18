/**
 * 改善效率過程時用的小工具
 */
export class TestTime {
  ts: Date
  isLog: boolean
  constructor(isLog=true) {
    this.ts = new Date();
    this.isLog = isLog
  }
  log(msg: string, isReset = true) {
    if ( this.isLog == false ) return 
    
    var te = new Date();
    console.log(msg + ' ' + (te.valueOf() - this.ts.valueOf()) + ' ms');
    if (isReset) {
      this.ts = te;
    }
  }
}
