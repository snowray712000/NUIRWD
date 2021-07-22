/// <reference path="../jsdoc/jquery.js" />
/// <reference path="../jsdoc/linq.d.ts" />
/// <reference path="SplitStringByRegex.js" />

(function(root,undefined){
  // 因為下面會寫到，所以要先確保可以用 (.ts 專案會不行)
  var Enumerable = getLinqEnumerable()

  /** @class */
  var Ijnjs = function(){}
  
  var _isReady = false
  Ijnjs.isReady = () => _isReady != false 

  /**
   * 
   * @param {Action} cbDo 
   * @param {FuncBool} cbTest 
   * @param {number} ms 
   */
  Ijnjs.testThenDo = function (cbDo, cbTest, ms){ 
    var ms = ms == undefined ? 33 : ms
    var test = cbTest !== undefined ? cbTest : Ijnjs.isReady

    var fnOnce = once ;    
    once()

    return
    function once(){
      if (test(Ijnjs)){
        cbDo()
      } else {
        setTimeout(() => {
          fnOnce()
        }, ms)
      }
    }
  }

  /**
   * 
   * @param {FuncBool|boolean} cbTest 
   * @param {string?} msg 
   */
  Ijnjs.assert = function (cbTest, msg){
    if (typeof cbTest === 'function'){
      if (false == cbTest()){
        throw Error (getMsg())
      }
    } else if ( typeof cbTest === 'boolean'){
      if ( false == cbTest ) {
        throw Error (getMsg())
      }
    }
    function getMsg () {
      if ( msg != undefined){
        return msg
      }
      if (typeof cbTest === 'function' ){
        return 'assert ' + cbTest.toString()
      }
      return 'assert fail.'
    }
  }

  var csses = [
    'ijn-dialog-base.css',
    'bible-version-dialog-picker.css'
  ]
  loadCss(csses)
  
  var deps = [
    {path:'SplitStringByRegex.js', cb: function(re){
      Ijnjs.SplitStringByRegex = re
    }},
    {path:'path.js', cb: function(re){
      Ijnjs.Path = re
    }},
    {path:'ijn-dialog-base.js', cb: function(re){
      Ijnjs.DialogBase = re
    }},
    {path:'bible-version-dialog-picker.js', cb: function(re){
      Ijnjs.BibleVersionDialog = re
    }},
  ]

  var ajaxs = loadJsAsync(deps)
  waitThenSetReadyAsync(ajaxs)
  
  exportModule()

  return

  function exportModule(){
    if (typeof define === 'function' && define.amd ){
      define('Ijnjs', [], function(){ return Ijnjs })
    } else if ( typeof module !== 'undefined' && module.exports ){
      module.exports = Ijnjs
    } else {
      root.Ijnjs = Ijnjs
    }
  }

  /**
   * 
   * @param {{path:string,cb:Action1}[]} deps 
   */
  function loadJsAsync(deps){
    var srd = getServerRootDirectory() // '/ijnjs/' 上線後 '/NUI/ijnjs/'
    return Enumerable.from(deps).select(generateOnePromise).toArray()
      /**
       * @param {{path:string,cb:Action}} a1 
       * @returns {Promise}
       */
      function generateOnePromise(a1) {
        return new Promise(fnPromise)
        function fnPromise(resolve,reject){
          $.ajax({
            url: srd + a1.path,
            dataType: 'text',    
            success: success
          })
          return // return fnPromise
          function success(strCode){
            // step1
            var re = {}
            evalExec()
  
            // step2 等待
            Ijnjs.testThenDo(()=>{
              // step3 最後一步, 設定給 Ijnjs, 完成 Promise
              a1.cb( getResult() )
              resolve()
            }, lib => isOkay())
            return // success return 
            function evalExec(){
              var fn = function(){ eval(strCode) }
              fn.call(re)
            }
            function isOkay(){
              return Object.keys(re).length != 0
              // 例如 bible-version-dialog-picker 就要先等 ijn-dialog-base
            }
            function getResult(){
              return re[Object.keys(re)[0]]
            }
          } 
        } // fnPromise
      } // generateOnePromse
    }// loadJsAsync
  /**
   * 
   * @param {string[]} csses 例 'ijn-dialog-base.css' 相對於這個 /static/ijnjs/ 這個位置
   */
  function loadCss(csses){
    var srd = getServerRootDirectory()
    Enumerable.from(csses).forEach(a1=>{
      $.ajax({
        url: srd + a1,
        dataType: 'text',
        success: cbSuccess
      })
      return
      function cbSuccess(strCode){
          // 不需要 document ready  
          // 方法2 (目前方法)
          var r1 = $('<style></style>')
          r1.html(strCode)
          $('head').append(r1)
      }
    })
  }

  function waitThenSetReadyAsync(ajaxs){
    Promise.all(ajaxs).then(()=>{
      chk()
      _isReady = true
      return 
      function chk(){
        var r1 = Enumerable.from(Object.keys(Ijnjs))
        var r2 = Enumerable.from(['SplitStringByRegex','DialogBase','BibleVersionDialog'])
          .all(a1=> r1.contains(a1))
        Ijnjs.assert( r2 )
      }
    })
  }

  function getLinqEnumerable(){
    if ( typeof Enumerable === 'undefined' ){
      if ( typeof require === 'function' ){
        return require('linq')
      }
    } 
    return window.Enumerable
  }
  function getServerRootDirectory(){
    if (isNUIDev()) { return dirNUIDev() }
    if (isRWDDev()) { return dirGit() }
    return dirServer()

    function isNUIDev(){return location.port == 5500}
    function isRWDDev(){return location.port == 4200}
    function dirServer(){return '/NUI/ijnjs/'}
    function dirNUIDev(){return '/ijnjs/'}
    function dirGit(){
      // https://raw.githubusercontent.com/snowray712000/ijnjs/main/ijn-dialog-base.js
      // https://raw.githubusercontent.com/snowray712000/ijnjs/main/ijn-dialog-base.css
      return 'https://raw.githubusercontent.com/snowray712000/ijnjs/main/'
    }
  }
})(this)


  /**
   * This callback is when dialog closed be called
   * @callback FuncBool
   * @param {Ijnjs} a1
   * @returns {boolean}
   */

  /**
   * This callback is when dialog closed be called
   * @callback Action
   */

  /**
   * This callback is when dialog closed be called
   * @callback Action1
   * @param {any} a1
   */

  /**
   * This callback is when dialog closed be called
   * @callback Action2
   * @param {any} a1
   * @param {any} a2
   */

  /**
   * This callback is when dialog closed be called
   * @callback Action3
   * @param {any} a1
   * @param {any} a2
   * @param {any} a3
   */

/**
 * Enumerable
 * @namespace Enumerable
 */
/**
 * Ijnjs
 * @namespace Ijnjs
 */
/**
 * isReady
 * @function isReady
 * @memberof Ijnjs
 */