/// <reference path="../../../../jsdoc/linq.d.ts" />
/// <reference path="../../../../jsdoc/jquery.js" />
/// <reference path="../../../../jsdoc/jquery-ui.js" />
/// <reference path="../../../../jsdoc/jquery.ui.touch-punch.js" />
/// <reference path="../../../../jsdoc/lodash.d.js" />
/// <reference path="../../../../jsdoc/require.js" />
/**
 * 只要 include ijnjs.js 馬上就能用了，會定義到 window
 * 但 ijnjs 則是 async 的
 * 你可以使用 testThenDo().then(...)
 * @param {{cbTest:()=>boolean;ms?:number;msg?:string;cntMax?:number}} args 
 */
function testThenDo(arg) { }

/**
 * @param {{cbTest:()=>boolean;ms?:number;msg?:string;cntMax?:number}} args 
 * @returns {Promise<any>}
 */
function testThenDoAsync(args) { }

/**
 * 供 ijnjs 或 ijnjs-ui 等等，一個 lib 的 main.js 使用
 * 可以取得它的路徑，再結合 location.href 或 pathname, 就可以知道，該傳什麼相對路徑
 * 不需等到 ijnjs 即可使用, 與 testThenDo 一樣
 * @param {string} nameThisJs 'ijnjs.js' 傳入 'ijnjs' 即可, 可能 .jn 或 .min.js 都可
 * @returns {string}
 */
function getHrefFromDocumentScripts(nameThisJs) { }

var ijnjs = (() => {
  /**
   * @param {{cbTest:()=>boolean;ms?:number;msg?:string;cntMax?:number}} args 
   */
  function testThenDo(arg) { }

  /**
   * @param {{cbTest:()=>boolean;ms?:number;msg?:string;cntMax?:number}} args 
   * @returns {Promise<any>}
   */
  function testThenDoAsync(args) { }

  /**
   * 供 ijnjs 或 ijnjs-ui 等等，一個 lib 的 main.js 使用
   * 可以取得它的路徑，再結合 location.href 或 pathname, 就可以知道，該傳什麼相對路徑
   * 不需等到 ijnjs 即可使用, 與 testThenDo 一樣
   * @param {string} nameThisJs 'ijnjs.js' 傳入 'ijnjs' 即可, 可能 .jn 或 .min.js 都可
   * @returns {string}
   */
  function getHrefFromDocumentScripts(nameThisJs) { }

  function Libs() {
    /**
     * @type {{$:jQuery;Enumerable:Enumerable}}
     */
    this.libs = {}
  }
  Libs.s = new Libs()

  function FileCache() { this.caches = {} }
  /**   
   * jquery 會略過，因為它應該已經取得
   * @static
   * @param {{na:string;url:string}[]} libs 
   * @returns {Promise<any>}
   */
  FileCache.prototype.loadFileCachesAsync = function loadFileCachesAsync(libs) { }


  function FileCache3rd() {
    this.data = new FileCache()
    // 產生 jsDoc 註解用
    // console.log(libs.map(a1 => "'" + a1.na + "'").join('|'))
    /**     
     * @param {'jquery'|'linq'|'jquery-ui'|'jquery-ui-css'|'jquery-touch'|'bootstrap-css'|'bootstrap'|'lodash'} na 
     * @returns {string}
     */
    this.getStr = function (na) {
      return this.data.caches[na].str
    }
    /**     
     * @param {'jquery'|'linq'|'jquery-ui'|'jquery-ui-css'|'jquery-touch'|'bootstrap-css'|'bootstrap'|'lodash'} na 
     * @param {string} str
     * @returns 
     */
    this.setStr = function (na, str) {
      if (this.data.caches[na] == undefined) {
        this.data.caches[na] = {}
      }
      this.data.caches[na].str = str
    }
    /**
     * @param {{na:string;url:string}} libs 
     * @returns {Promise<string>}
     */
    this.loadAsync = function (libs) {
      return this.data.loadFileCachesAsync(libs)
    }
  }
  FileCache3rd.s = new FileCache3rd()

  function FileCacheIjnjs() {
    this.data = new FileCache()
    /**     
     * @param {{na:string}[]} libs 
     */
    this.generateJsDoc = function (libs) {
      var r1 = libs.map(a1 => "'" + a1.na + "'").join('|')
      console.log(r1)
    }
    /**     
     * @param {'Path'|'SplitStringByRegex'|'assert'|'TestTime'|'rem2Px'|'BookChapDialog/BookChapDialog'|'BookChapDialog/BookChapDialog.css'|'BookChapDialog/BookChapDialog.html'} na 
     * @param {string} str 
     */
    this.setStr = function (na, str) {
      if (this.data.caches[na] == undefined) {
        this.data.caches[na] = {}
      }
      this.data.caches[na].str = str
    }
    /**     
     * @param {'Path'|'SplitStringByRegex'|'assert'|'TestTime'|'rem2Px'|'BookChapDialog/BookChapDialog'|'BookChapDialog/BookChapDialog.css'|'BookChapDialog/BookChapDialog.html'} na 
     * @returns {string}
     */
    this.getStr = function (na) {
      return this.data.caches[na].str
    }
  }
  /**   
   * @param {(string|{dir:string;children:any[]})[]} fileDescription 
   */
  FileCacheIjnjs.prototype.loadAsync = function (fileDescription) {
    var $ = Libs.s.libs.$
    var Enumerable = Libs.s.libs.Enumerable

    var urls = toStandardUrls(fileDescription)
    // this.generateJsDoc(urls)

    var that = this
    return Promise.all(urls.map(a1 => {
      return new Promise((res, rej) => {
        $.ajax({
          url: a1.url,
          dataType: 'text',
          complete: () => res(a1),
          success: (str) => {
            that.setStr(a1.na, str)
          }
        })
      })
    }))


    /**
     * 取得 ijnjs 分離的檔案過程要用的
     * @param {(string|{dir:string;children:any[]})[]} descript 
     */
    function toStandardUrls(descript) {
      /** @type {{na:string;url:string}[]} */
      var re = []

      // // 中途會轉成這樣去處理(遞迴結構，轉為 {}[])
      // var libs2 = [
      //   { na: 'Path', },
      //   { na: 'SplitStringByRegex', },
      //   { na: 'assert',},
      //   { na: 'TestTime', },
      //   { na: 'rem2Px',  },
      //   { na: 'BookChapDialog/BookChapDialog',  },
      //   { na: 'BookChapDialog/BookChapDialog.css',},
      //   { na: 'BookChapDialog/BookChapDialog.html', },
      //   { na: 'BookChapDialog/dir2/file1', url: },
      // ]    
      var fn = function (ja, dir) {
        for (var a1 of ja) {
          if (typeof a1 == 'string') {
            re.push({ na: dir + a1 })
          } else {
            var dir2 = dir == '' ? (a1.dir + '/') : (dir + a1.dir + '/')
            fn(a1.children, dir2)
          }
        }
      }
      fn(descript, '')

      var srd = getSrd()
      for (var a1 of re) {
        var ext = getExt(a1.na)
        if (ext == undefined) {
          a1.url = srd + a1.na + '.js'
        } else {
          a1.url = srd + a1.na
        }
      }

      return re
      /** 
       * 要用在 自動加 .js 用
       * @param {string} na
       * @returns {string|undefined}
       */
      function getExt(na) {
        var n = na.length
        for (var i = n - 1; i >= 0; i--) {
          if (na[i] == '/') {
            return undefined
          } else if (na[i] == '.') {
            return na.substring(i + 1)
          }
        }
        return undefined
      }
      function getSrd() {
        // 情境
        // pathname: /NUI_dev/tests/ijnjsTests.html 
        // 自己: http://127.0.0.1:5502/NUI_dev/src/assets/libs/ijnjs/ijnjs.js 
        // 目標(以下兩種都可成功，試過了)
        // var srd = '/NUI_dev/src/assets/libs/ijnjs/'
        // var srd = '../src/assets/libs/ijnjs/'
        // 
        // step1: 自己變 /NUI_dev/src/assets/libs/ijnjs/ijnjs.js

        var r1 = getHrefFromDocumentScripts('ijnjs')
        var r2 = r1.substring(0, r1.lastIndexOf('/') + 1)
        var r3 = r2.replace(location.origin, '')
        return r3
      }
    }
  }
  FileCacheIjnjs.s = new FileCacheIjnjs()

  /** 
   * js global 的 exec 我覺得不直覺，所以寫一個 exec global 版的
   * @param {RegExp} reg reg 若非 global 會自動變為 global, 但我不能幫你變, 因為這是唯讀
   * @param {string} str
   * @returns {RegExpExecArray[]}
  */
  function matchGlobalWithCapture(reg, str) { }
  /** 
   * 因為 string.split 不夠我使用，所以開發一個 regex 的來用
   * @example
   * // 12321
   * new SplitStringByRegex().main("取出eng的word",/\w+/ig)
   * @class
  */
  function SplitStringByRegex() { }
  /** 
   * 若沒有符合 Regex，仍然會回傳 [{w:str}]
   * @param {string} str asfwefwe
   * @param {Split} reg fwefwaefwf
   * @returns {{w:string; exec?:RegExpExecArray }[]}
  */
  SplitStringByRegex.prototype.main = function (str, reg) { }

  // exports namespace 
  function ijnjs() { }
  ijnjs.prototype.Libs = Libs
  ijnjs.prototype.FileCache = FileCache
  ijnjs.prototype.testThenDo = testThenDo
  ijnjs.prototype.testThenDoAsync = testThenDoAsync
  ijnjs.prototype.getHrefFromDocumentScripts = getHrefFromDocumentScripts
  ijnjs.prototype.matchGlobalWithCapture = matchGlobalWithCapture
  ijnjs.prototype.SplitStringByRegex = SplitStringByRegex


  return new ijnjs()
})(this)