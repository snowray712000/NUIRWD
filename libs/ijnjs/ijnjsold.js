/// <reference path="../jsdoc/jquery.js" />
/// <reference path="../jsdoc/linq.d.ts" />
/// <reference path="SplitStringByRegex.js" />

const { assert } = require("./assert")
const { rem2Px } = require("./rem2Px")

const { TestTime } = require("./TestTime")

  (function (root, undefined) {
    console.log((new Error).fileName)
    console.log(window.document.scripts)

    // 因為下面會寫到，所以要先確保可以用 (.ts 專案會不行)
    var Enumerable = getLinqEnumerable()

    /** @class */
    var Ijnjs = function () { }

    Ijnjs.TestTime = TestTime

    var dt = new TestTime(false)

    var _isReady = false
    Ijnjs.isReady = () => _isReady != false

    /**
     * 
     * @param {Action} cbDo 
     * @param {FuncBool} cbTest 
     * @param {number} ms 
     */
    Ijnjs.testThenDo = testThenDo

    /**
     * 
     * @param {FuncBool|boolean} cbTest 
     * @param {string?} msg 
     */
    Ijnjs.assert = assert

    Ijnjs.rem2Px = rem2Px
    Ijnjs.isLessMidWindow = () => $(window).width() < Ijnjs.rem2Px(36)
    /**
     * 測試的 /tests/xxx.html 與 /index.html 位置不同
     * 回傳 ../ijnjs/ 或 ijnjs/ 或 NUII/ijnjs/ 
     * @param {string} dir 例如，'ijnjs' 'ijnjs-fhl'
     * @returns 
     */
    Ijnjs.getSrd = function (dir) {
      var r1 = Ijnjs.Path.getDirectoryName(location.pathname)
      // /NUI or /NUI/tests or ''
      var cnt = 0
      for (let i = 0; i < r1.length; i++) {
        if (r1[i] == '/') {
          cnt++
        }
      }
      if (cnt == 2) {
        return '../' + dir + '/'
        // return '../ijnjs-fhl/'
      } else if (cnt == 1) {
        return dir + '/'
        // return 'ijnjs-fhl/'
      } else {
        return 'NUII/' + dir + '/'
        // return 'NUII/ijnjs-fhl/'
      }
    }

    /** {} 裡的，要append到 obj 中時, 在 load IIFE 常用到 */
    Ijnjs.appendObjectTo = function (objSrc, objDst) {
      for (var k in objSrc) {
        objDst[k] = objSrc[k]
      }
    }
    generateOnePromise(
      {
        path: 'path.js', cb: function (re) {
          Ijnjs.Path = re
          dt.log('至 path ', false)
          console.log(78)
        }, async: false
      }
    )


    /** 通常是用在 .html 檔 */
    Ijnjs.loadJsSync = loadJsSync
    Ijnjs.loadCssSync = loadCssSync
    Ijnjs.loadJsOrCssSync = loadJsOrCssSync


    /** 似乎還有些問題，建議盡量不用 */
    Ijnjs.loadJsInIIFEModel = function (path, isCache, isAsync) {

      return new Promise((res, rej) => {
        Ijnjs.testThenDo(() => {
          var srd = Ijnjs.Path.getDirectoryName(location.pathname) + '/' // '/NUI_dev/index.html' -> '/NUI_dev/'

          var settings = {
            url: srd + path,
            dataType: 'text',

            success: cb
          }
          if (isCache != undefined) {
            settings.cache = isCache
          }
          if (isAsync != undefined) {
            settings.async = isAsync
          }

          $.ajax(settings)
          function cb(strCode) {
            var fn = function () { eval(strCode) }
            var re = {}
            fn.call(re)

            Ijnjs.testThenDo(() => {
              res(re)
            }, ijn => Object.keys(re).length != 0)
          }
        }, ijn => Ijnjs.Path != undefined)
      })
    }



    var csses = [
      'ijn-dialog-base.css',
      'bible-version-dialog-picker.css'
    ]
    loadCss(csses)

    var deps = [
      {
        path: 'SplitStringByRegex.js', cb: function (re) {
          Ijnjs.SplitStringByRegex = re
          dt.log('至 SplitStringByRegex ', false)
        }
      },
      {
        path: 'ijn-dialog-base.js', cb: function (re) {
          Ijnjs.DialogBase = re
          dt.log('至 DialogBase ', false)
        }
      },
      {
        path: 'bible-version-dialog-picker.js', cb: function (re) {
          Ijnjs.BibleVersionDialog = re
          dt.log('至 BibleVersionDialog ', false)
        }
      },
    ]

    var ajaxs = loadJsAsync(deps)
    waitThenSetReadyAsync(ajaxs)

    exportModule()

    return
    function loadJsOrCssSync(url) {
      if (/.js$/i.test(url)) {
        loadJsSync(url, false)
        $("head").append($("<script>", {
          src: url,
        }));
      } else if (/.css$/i.test(url)) {
        // loadCssSync(url)
        $("head").append($("<link>", {
          rel: "stylesheet",
          type: "text/css",
          href: url
        }));
      } else if (/.ico$/i.test(url)) {
        // <link rel="shortcut icon" href=static/images/FHLLOGO.ico type=image/x-icon>
        $("head").append($("<link>", {
          href: url,
          rel: 'shortcut icon',
          type: 'image/x-icon',
        }))
      }
    }
    function loadCssSync(url) {
      var isCache = true

      $.ajax({ url: url, dataType: 'text', async: false, cache: true, success: cbSuccess })
      function cbSuccess(strCode) {
        // 不需要 document ready  
        // 方法2 (目前方法)
        var r1 = $('<style></style>')
        r1.html(strCode)
        $('head').append(r1)
      }
    }
    function loadJsSync(url, isCache) {
      isCache = isCache == undefined ? false : isCache

      if (isCache) {
        $.ajax({
          url: url, dataType: 'text', async: false, cache: true, success: function (str) {
            function aaa() { eval(str) }
            aaa.call(window)
          }
        })
      } else {
        $.ajax({ url: url, dataType: 'script', async: false })
      }
    }
    function exportModule() {
      if (typeof define === 'function' && define.amd) {
        define('Ijnjs', [], function () { return Ijnjs })
      } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = Ijnjs
      } else {
        root.Ijnjs = Ijnjs
      }
    }

    /**
     * 
     * @param {{path:string,cb:Action1}[]} deps 
     */
    function loadJsAsync(deps) {
      return Enumerable.from(deps).select(generateOnePromise).toArray()
    }// loadJsAsync
    /**
       * @param {{path:string;cb:Action;async?:boolean}} a1 
       * @returns {Promise}
       */
    function generateOnePromise(a1) {
      var srd = getServerRootDirectory() // '/ijnjs/' 上線後 '/NUI/ijnjs/'
      return new Promise(fnPromise)
      function fnPromise(resolve, reject) {
        $.ajax({
          url: srd + a1.path,
          dataType: 'text',
          cache: false,
          async: a1.async,
          success: success
        })
        return // return fnPromise
        function success(strCode) {
          // step1
          var re = {}
          evalExec()

          // step2 等待
          Ijnjs.testThenDo(() => {
            // step3 最後一步, 設定給 Ijnjs, 完成 Promise
            a1.cb(getResult())
            resolve()
          }, lib => isOkay())
          return // success return 
          function evalExec() {
            var fn = function () { eval(strCode) }
            fn.call(re)
          }
          function isOkay() {
            return Object.keys(re).length != 0
            // 例如 bible-version-dialog-picker 就要先等 ijn-dialog-base
          }
          function getResult() {
            return re[Object.keys(re)[0]]
          }
        }
      } // fnPromise
    } // generateOnePromse
    /**
     * 
     * @param {string[]} csses 例 'ijn-dialog-base.css' 相對於這個 /static/ijnjs/ 這個位置
     */
    function loadCss(csses) {
      var srd = getServerRootDirectory()
      Enumerable.from(csses).forEach(a1 => {
        $.ajax({
          url: srd + a1,
          dataType: 'text',
          cache: false,
          success: cbSuccess
        })
        return
        function cbSuccess(strCode) {
          // 不需要 document ready  
          // 方法2 (目前方法)
          var r1 = $('<style></style>')
          r1.html(strCode)
          $('head').append(r1)
        }
      })
    }

    function waitThenSetReadyAsync(ajaxs) {
      Promise.all(ajaxs).then(() => {
        chk()
        _isReady = true
        return
        function chk() {
          var r1 = Enumerable.from(Object.keys(Ijnjs))
          var r2 = Enumerable.from(['SplitStringByRegex', 'DialogBase', 'BibleVersionDialog'])
            .all(a1 => r1.contains(a1))
          Ijnjs.assert(r2)
        }
      })
    }

    function getLinqEnumerable() {
      if (typeof Enumerable === 'undefined') {
        // for typescript
        if (typeof require === 'function') {
          return require('linq')
        }
      }
      return window.Enumerable
    }
    function getServerRootDirectory() {
      if (isNUIDev()) { return dirNUIDev() }
      if (isRWDDev()) { return dirGit() }
      return dirServer()

      function isNUIDev() { return location.port == 5500 }
      function isRWDDev() { return location.port == 4200 }
      function dirServer() { return '/NUI/ijnjs/' }
      function dirNUIDev() { return '/ijnjs/' }
      function dirGit() {
        // https://raw.githubusercontent.com/snowray712000/ijnjs/main/ijn-dialog-base.js
        // https://raw.githubusercontent.com/snowray712000/ijnjs/main/ijn-dialog-base.css
        return 'https://raw.githubusercontent.com/snowray712000/ijnjs/main/'
      }
    }



  })(this)


