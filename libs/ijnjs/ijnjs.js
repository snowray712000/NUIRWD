/// <reference path="../../../../jsdoc/linq.d.ts" />
/// <reference path="../../../../jsdoc/jquery.js" />
/// <reference path="../../../../jsdoc/jquery-ui.js" />
/// <reference path="../../../../jsdoc/jquery.ui.touch-punch.js" />
/// <reference path="../../../../jsdoc/lodash.d.js" />
/// <reference path="../../../../jsdoc/require.js" />
/// <reference path="ijnjs.d.js" />

(function (root) {
  // 馬上匯出給使用
  window.testThenDo = testThenDo
  window.testThenDoAsync = testThenDoAsync
  window.getHrefFromDocumentScripts = getHrefFromDocumentScripts

  var libs = [
    { na: 'jquery', url: 'https://code.jquery.com/jquery-3.6.0.min.js' },
    { na: 'linq', url: 'https://unpkg.com/linq@3.2.4/linq.min.js' },
    { na: 'jquery-ui', url: 'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js' },
    { na: 'jquery-ui-css', url: 'https://code.jquery.com/ui/1.12.1/themes/blitzer/jquery-ui.css' },
    { na: 'jquery-touch', url: 'assets/libs/jquery.ui.touch-punch.min.js' },
    { na: 'bootstrap-css', url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css' },
    { na: 'bootstrap', url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js' },
    // { na: 'popper', url: 'https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js'},
    // { na: 'bootstrap', url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js'},
    { na: 'lodash', url: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js' }
    // { na: 'bootstrap', url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.map' },
  ]

  var ijnjsFileDescript = [
    'Path', 'SplitStringByRegex', 'assert', 'TestTime', 'rem2Px',
    {
      dir: 'BookChapDialog', children: [
        // 'BookChapDialog', 'BookChapDialog.css', 'BookChapDialog.html'
      ]
    }
  ]

  function FileCacheIjnjs() {
    this.data = new FileCache()
    this.list = [] // 保持原本的順序，因為 data 是個 dict，不一定會有按順序，於loadAsync過程會產生
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
    var that = this

    var urls = toStandardUrls(fileDescription)
    that.list = urls.map(a1 => a1.na)
    // this.generateJsDoc(urls)

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
            return na.substr(i + 1)
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
  ijnjs.FileCacheIjnjs = FileCacheIjnjs // 要先加進去供 ijnjs 其它檔可能會使用, 尤其是此 js 控制 對應的 css html 時

  function ijnjs() { this.name = 'ijnjs' }
  ijnjs.Libs = Libs
  ijnjs.FileCache = FileCache

  function Libs() {
    /**
     * @type {{$:jQuery;Enumerable:Enumerable;bootstrap:bootstrap;_:_}}
     */
    this.libs = {}
  }
  Libs.s = new Libs()

  function FileCache() {
    /**
     * dict jsDoc 寫法
     * @type {Object.<string, {str:string}>}
     */
    this.caches = {}
    this.clear = () => this.caches = {}
  }

  /**   
   * jquery 會略過，因為它應該已經取得   
   * @param {{na:string;url:string}[]} libs 
   * @returns {Promise<any>}
   */
  FileCache.prototype.loadFileCachesAsync = function loadFileCachesAsync(libs) {
    var $ = Libs.s.libs.$

    var r1 = libs.filter(a1 => a1.na != 'jquery').map(a1 => {
      return new Promise((res2) => {
        $.ajax({
          url: a1.url,
          dataType: 'text',
          complete: () => {
            res2()
          }, success: str => {
            this.caches[a1.na] = { str: str }
          }
        })
      })
    })
    return Promise.all(r1)
  }
  function FileCache3rd() {
    this.data = new FileCache()
    // 產生 jsDoc 註解用
    // console.log(libs.map(a1 => "'" + a1.na + "'").join('|'))
    /**     
     * @param {'popper'|'jquery'|'linq'|'jquery-ui'|'jquery-ui-css'|'jquery-touch'|'bootstrap-css'|'bootstrap'|'lodash'} na 
     * @returns {string}
     */
    this.getStr = function (na) {
      if (this.data.caches[na] == undefined) {
        this.data.caches[na] = {}
      }
      return this.data.caches[na].str
    }
    /**     
     * @param {'popper'|'jquery'|'linq'|'jquery-ui'|'jquery-ui-css'|'jquery-touch'|'bootstrap-css'|'bootstrap'|'lodash'} na 
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
  ijnjs.FileCache3rd = FileCache3rd

  getJQueryAsync().then(a1 => {
    Libs.s.libs.$ = a1.$

    var promise3rd = load3rdCodeAsync() //開始抓 async , 抓完後會處理
    var promiseijnjs = FileCacheIjnjs.s.loadAsync(ijnjsFileDescript) // 開始抓 async 
    // 3rd , ijnjs files 都同時抓
    promise3rd.then(() => {
      promiseijnjs.then(a1 => {

        // 開始處理 filecache
        processIjnjsFile()

        // 快取用完了，釋放掉 (Async是判定它 document.ready 時要用的也用完了)
        releaseCacheFromIjnjsAsync()

        // export
        exportToRootAndDefine()
      })
    })
  })

  return

  function processIjnjsFile() {
    var s = FileCacheIjnjs.s

    // function Path() { }
    // Path.prototype.aa = () => { }
    // ijnjs.Path = Path    
    ijnjs.Path = { aa: () => { } }
    
    for (var a1 of ['Path', 'SplitStringByRegex', 'assert', 'TestTime', 'rem2Px']) {
      function f1() { eval(s.getStr(a1)) }
      var tmp = {}
      f1.call(tmp)

      if (tmp.exports != undefined) {
        var keys = Object.keys(tmp.exports)
        for (var k of keys) {
          ijnjs[k] = tmp.exports[k]
        }
      } else {
        var k = Object.keys(tmp)[0]
        // ijnjs[k] = tmp[k]

        if (ijnjs[k] != undefined) {

          var r1 = ijnjs[k]
          var r2 = tmp[k]

          if (typeof r1 == 'object') {
            if (typeof r2 == 'object') {

            }            
            // "getDirectoryName", "getFileName", ...
            // console.log(Object.keys(tmp[k]))
            // for (var k2 of Object.keys(r2)) {
            //   r1[k2] = tmp[k][k2]
            // }
            for (var k2 of Object.keys(r2)) {
              r1[k2] = r2[k2]
            }
            for (var k2 of Object.keys(r2.prototype)) {
              r1.prototype[k2] = r2.prototype[k2]
            }
          } else if (typeof r1 == 'function') {

            for (var k2 of Object.keys(r2)) {
              r1[k2] = r2[k2]
            }
            for (var k2 of Object.keys(r2.prototype)) {
              r1.prototype[k2] = r2.prototype[k2]
            }
          } else {
            ijnjs[k] = r2
          }

        } else {
          ijnjs[k] = tmp[k]
        }
      }
    }

    console.log(ijnjs)

  }
  // 全部完成後，準備要 export 時用到
  function releaseCacheFromIjnjsAsync() {
    return testThenDoAsync({
      cbTest: () => ijnjs.Libs.s.libs.bootstrap != undefined,
      msg: 'release ijnjs cache'
    }).then(() => {
      // (不能在這釋放，還有些要在 ready 的時候用)
      FileCache3rd.s.data.clear()
      FileCacheIjnjs.s.data.clear()
      delete ijnjs.FileCache3rd
      delete ijnjs.FileCacheIjnjs
    })
  }
  function exportToRootAndDefine() {
    // 學 lodash, 就是不論有沒有 define, 都還是輸出 root
    // 像我的 es5 專案的 define 裡的 callback 就沒呼叫，不知道哪弄錯
    root.ijnjs = ijnjs

    var isAMD = typeof define === 'function' && define.amd
    if (isAMD) {
      define('ijnjs', [], function () {
        return ijnjs
      })
    }
  }
  /**
   * 供 ijnjs 或 ijnjs-ui 等等，一個 lib 的 main.js 使用
   * 可以取得它的路徑，再結合 location.href 或 pathname, 就可以知道，該傳什麼相對路徑
   * 不需等到 ijnjs 即可使用, 與 testThenDo 一樣
   * 
   * @param {string} nameThisJs 'ijnjs.js' 傳入 'ijnjs' 即可, 可能 .jn 或 .min.js 都可
   * @returns {string}
   */
  function getHrefFromDocumentScripts(nameThisJs) {
    var reg = new RegExp(nameThisJs + '(?:.min)?.js$', 'i')
    // ijnjs.js/require.js ... 這種 case 要避免

    // ijnjs.js.ui.js ... 這種 case 要避免 Regexp 要加尾端 $
    // 承上，(測試成功，把檔案拿掉尾巴即可測，就會變undefine)

    // ijnjs.min.js ijnjs.js 都要可以
    // regex 多一個 (.min)? 但不 capture 所以再加 ?:

    // 測試過，還沒 docuemnt.ready 也可以取得局部  
    // Path 工具還沒載入，不能在這使用
    for (var a1 of document.scripts) {
      if (a1.src != undefined) {
        var na = getName(a1.src)
        if (na != undefined) {
          if (reg.test(na)) {
            return a1.src
          }
        }
      }
    }
    return undefined
    /** 
     * http://127.0.0.1:5502/NUI_dev/jsdoc/require.min.js => require.min.js
     * @param {string} src 
     * */
    function getName(src) {
      var n = src.length
      for (let i = n - 1; i >= 0; i--) {
        if (src[i] == '/') {
          return src.substr(i + 1)
        }
      }
      return undefined
    }
  }
  /** 不包含 jqueryui */
  function load3rdCodeAsync() {
    if (Libs.s.libs.$ == undefined) {
      throw new Error('assert $ aleary exist.')
    }
    return FileCache3rd.s.loadAsync(libs).then(a1 => {

      noRequireJs(() => {
        addLinqJs()
        addJQueryUiAndTouchNowAndCssWhenReady()
        addBootstrapWhenReady() // ready 才加的 js，裡面也要 
        addLodash()
      })

      return
      function addLodash() {
        function aaa() { eval(FileCache3rd.s.getStr("lodash")) }
        aaa.call(window) // 只能 window
        Libs.s.libs._ = window._
        delete window._
      }
      function addBootstrapWhenReady() {
        var $ = Libs.s.libs.$
        $(() => {
          noRequireJs(() => {
            // ready 時，加入 css
            $('<style>', {
              text: FileCache3rd.s.getStr("bootstrap-css")
            }).appendTo($('head'))

            function aaa() {
              eval(FileCache3rd.s.getStr("bootstrap"))
            }
            aaa.call(window) // 在 window 下，呼叫才會生效
            // 不 delete window.bootstrap 不知道它什麼時候會用到
            Libs.s.libs.bootstrap = window.bootstrap
          })
        })
      }
      function addJQueryUiAndTouchNowAndCssWhenReady() {
        var $ = Libs.s.libs.$
        window.jQuery = $ // 它會作用到 window.jQuery 上，所以要先加回去
        function aaa() {
          eval(FileCache3rd.s.getStr("jquery-ui"))
          eval(FileCache3rd.s.getStr("jquery-touch"))
        }

        aaa.call(window)

        $(() => {
          //ready 時，加入 css
          $("<style>", { text: FileCache3rd.s.getStr("jquery-ui-css") }).appendTo($('head'))
        })
        delete window.jQuery
      }
      function addLinqJs() {
        function aaa() {
          eval(FileCache3rd.s.getStr("linq"))
        }
        aaa.call(Libs.s.libs)
      }
    })
  }
  function noRequireJs(cbDo) {
    var old = {}
    backup()
    cbDo()
    restore()
    return
    function backup() {
      if (window.define != undefined) {
        for (var a of ['define', 'requirejs', 'require']) {
          old[a] = window[a]
          window[a] = undefined
        }
      }
    }
    function restore() {
      if (old.define != undefined) {
        for (var a of ['define', 'requirejs', 'require']) {
          window[a] = old[a]
          delete old[a]
        }
      }
    }
  }
  /**
   * 只有 jquery 不是用 $.ajax 
   * @returns {Promise<{$:jQuery}>} 
   * */
  function getJQueryAsync() {
    
    return new Promise((res, rej) => {
      var r1 = new XMLHttpRequest()
      r1.onerror = a1 => { rej(a1) }
      r1.onload = (a1) => {
        if (304 == r1.status || (r1.status >= 200 && r1.status < 300)) {
          FileCache3rd.s.setStr("jquery", r1.responseText)
          noRequireJs(() => {
            eval(FileCache3rd.s.getStr("jquery")) // 經測試與看 source code，在 es5下，都是輸出到 window.$
          })
          
          var r2 = {}
          r2.$ = window.$
          delete window.$
          delete window.jQuery
          
          window.$ = r2.$
          res(r2)
        } else {
          rej(new Error('status code ' + r1.status + ' ' + r1.statusText))
        }
      }
      r1.open('get', libs[0].url, true)
      r1.send()
    })
  }
  /**
   * @param {{cbTest:()=>boolean;ms?:number;msg?:string;cntMax?:number}} args 
   */
  function testThenDoAsync(args) {
    if (typeof args != 'object') { throw new Error('call testThen Do, args already use {}') }
    return new Promise((res, rej) => {
      args.cbDo = () => res()
      args.cbErr = (err) => res(err)
      testThenDo(args)
    })
  }
  /**
   * @param {{cbDo:()=>{};cbTest:()=>boolean;ms?:number;msg?:string;cntMax?:number;cbErr?:(err:any)=>{}}} args 
   */
  function testThenDo(args) {
    if (typeof args != 'object') { throw new Error('call testThen Do, args already use {}') }

    var ms = args.ms == undefined ? 333 : args.ms
    var test = args.cbTest == undefined ? () => true : args.cbTest
    var msg = args.msg == undefined ? '' : args.msg
    var cbErr = args.cbErr == undefined ? () => { } : args.cbErr
    var cbDo = args.cbDo == undefined ? () => { } : args.cbDo

    var cntMax = args.cntMax == undefined ? 50 : args.cntMax
    var cnt = 0

    var fnOnce = once;
    try {
      once()
    } catch (error) {
      cbErr(error)
    }

    return
    function once() {
      if (test()) {
        cbDo()
      } else {
        cnt += 1
        if (cnt > cntMax) {
          console.log('wait limit max count. ' + cntMax)
          cbErr(new Error('wait limit max count.' + cntMax))
        } else {
          console.log('wait ' + msg)
          setTimeout(() => {
            fnOnce()
          }, ms)
        }
      }
    }
  }
})(this)