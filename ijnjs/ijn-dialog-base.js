/// <reference path="../jsdoc/jquery.js" />
(function(root,undefined){

  root.exportsijn = DialogBase

  return 
/**
 * 當時開發，是為了 聖經版本 選擇作的
 * 所以此檔案的 tests.html 是 bible-version-dialog-pickerTests.html
 * @param {string} id - 例如, dialog1
 * @param {()->string} fnRender - 產生html的string, 通常在 show() 被呼叫時過程會被呼叫
 * @param {(JQuery)->()} fnAppended - 通常在 show() 被呼叫後，正式 appended 之後這就會被呼叫，通常拿來註冊事件
 * @param {(JQuery)->()} fnHided - dialog 按關閉時觸發
 * @param {(JQuery)->()} fnShowed - dialog 按顯示(或再次顯示時)時觸發
 * @returns 
 */
 function DialogBase(id,fnRender,fnAppended,fnHided,fnShowed){
  var that = this
  this.id = id 
  this.divBase = render()
  this.fnRender = fnRender != undefined ? fnRender : function(){return "<div>test</div>"}
  this.fnAppended = fnAppended != undefined ? fnAppended : function(jqCustomer){ console.log(jqCustomer)}
  this.fnShowed = fnShowed != undefined ? fnShowed : function(jq){console.log(jq)}
  this.fnHided = fnHided != undefined ? fnHided : function(jqCustomer){ console.log(jqCustomer) }

  // lazy 變數，在 show 被呼叫時會被初始化
  this.jqObjBase = $()
  // lazy 變數，在 show 被呼叫時會被初始化
  this.jqObjDialog = $()
  // lazy 變數，在 callback appended 時會被初始化 (也是 show 時)
  this.jqObjCloseButton = $()
  // $("#dialogs").append(this.divBase)

  /** 
   * 供外部人使人，或自己使用
  */
  this.show = function(){
    getJQDialogGraySurly().show()
    that.fnShowed(getJQCustomer())
  }
  /**
   * 供 Close 按下使用，或外部使用
   * */
  this.hide = function(){
    getJQDialogGraySurly().hide()
    that.fnHided(getJQCustomer())
  }      

  this.isShow = function(){
    return getJQDialogGraySurly().css("display") != "none"
  }
  return ; // 下面是 local function

  function render(){
    // id = dialog1
    var newElems = $('<div id="'+id+'" class="ijn-dialog-gray">\
      <div class="ijn-dialog-white">\
        <div class="ijn-dialog-close"></div>\
        <div class="ijn-customer">\
        </div>\
      </div>\
    </div>\
    ')
    return newElems
  }
  /** 
   * 當 show () 被呼叫時，發現是第1次append進 body 時
   * 會呼叫此函式，通常可以在這裡註冊一些事件等初始化的動作
   * close () 按鈕 click 就是在這註冊
  */
  function fnDomAppended(){
    getJQDialogClose().on('click',function(){
      that.hide()
    })

    $(document).on('keyup',function(e){
      if ( ["Enter","Escape"," "].includes( e.originalEvent.key)){
        // 開啟著，才呼叫，不然使用者的 hide callback 會一直被呼叫
        if ( that.isShow() ){
          that.hide()          
        }
      }
    })

    getJQDialogGraySurly().on('mouseenter',function(e){
      getJQCustomer().trigger('click') // focus
    })

    // 開始呼叫使用者的資料
    var domCustomer = that.fnRender()
    getJQCustomer().append(domCustomer)
    that.fnAppended(getJQCustomer())
  }

  function getJQCustomer(){ return getJQDialogWhite().children(".ijn-customer")}
  function getJQDialogClose(){
    if (that.jqObjDialog.length != 0 ){
      return that.jqObjCloseButton
    }
    that.jqObjCloseButton = getJQDialogWhite().children(".ijn-dialog-close")
    return that.jqObjCloseButton
  }
  function getJQDialogWhite(){
    if (that.jqObjDialog.length != 0){
      return that.jqObjDialog
    }
    that.jqObjDialog = getJQDialogGraySurly().children(".ijn-dialog-white")
    return that.jqObjDialog
  }
  /** 
   * 若 thisDom 還沒加在 dom 中，實際上還取不到任何東西
   * 這時候會自動將其丟入 body 下的 #DialogBases
   * 若還沒有 DialogBases 會自動建
   * @returns {JQuery}
  */
  function getJQDialogGraySurly(){
    var r2 = $("#"+that.id)
    if (r2.length==0){
      var r1 = getDialogBasesJObjSurly()
      r1.append(that.divBase)
      
      fnDomAppended()           
      
      that.jqObjBase = $("#"+that.id)
      return that.jqObjBase
    }
    return r2

    function getDialogBasesJObjSurly(){
      var r1 = $("#ijn-dialogs")
      if ( r1.length == 0){
        $("body").append($('<div id="ijn-dialogs"></div>'))
        return $("#ijn-dialogs")
      }
      
      return r1
    }
  }
}
  
})(this)
