/// <reference path="../jsdoc/jquery.js" />
/// <reference path="../jsdoc/linq.d.ts" />
/// <reference path="ijnjs.d.ts" />
/// <reference path="ijn-dialog-base.js" />
/**
 * @file 這是開發 聖經版本 選擇所作的, 這裡的函式要搭配 ijn-dialog-base.js 而作的 callback 函式
 * @author Emmanuel Lo
 * jquery.js - 
 * 實際上用的 jquery lib 是用網路上的 CDN, 
 * 但為了讓 .js 程式開發中, 能夠正確出現型態, 
 * 所以還是下載下來, 並用 reference path 指定
 * <script src="https://code.jquery.com/jquery-3.x-git.min.js"></script>
 * <script src="https://unpkg.com/linq@3.2.3/linq.min.js"></script>
 */

(function(root,undefined){

  Ijnjs.testThenDo( () => {
    root.exportsijn = BibleVersionDialog
  }, exports => {
    return typeof exports.DialogBase !== 'undefined' 
  })

  return 
/**
 * 
 * @param {string} id - 'dialog1' 'diglog-versions' 都行 
 * @param {WhenClosedCallback} fnClosedDialog - closed dialog 後，要作的事
 * @param {{book:string,cname:string}[]} abvRecords - uiabv api 的結果
 * @param {FnAction} cbShowed - 在 show 的時候, 要把一些東西隱藏, 不然會遮到
 * @returns 
 */
 function BibleVersionDialog(id,fnClosedDialog,abvRecords,cbShowed){
  var that = this
  var id = id
  var langActived = 'ch'
  var bookActived = ['unv'] // 在 show 會傳入, 這裡寫 'unv' 只是讓 VScode 判定型別用
  var abvRecords = abvRecords != undefined ? abvRecords : []
  /** @type {WhenClosedCallback} */
  this.fnClosedDialog = fnClosedDialog != undefined ? fnClosedDialog : a1 => console.log(a1)
  this.cbShowed = cbShowed != undefined ? cbShowed : a1 => console.log(a1)
  var ch = new ChineseBook() // 中文聖經，比較複雜，所以重構成 class 來實作



  var DialogBase = typeof DialogBase === 'undefined' ? Ijnjs.DialogBase : DialogBase
  // 不要用 this.dialogBase = , 用下面方式, 把它對外部使用者隱藏起來
  var dialogBase = new DialogBase(id,
    fnRender,
    fnAppended,
    fnClosed,
    fnShowed)

  /**
   * 外部呼叫 show 時，可傳入目前的版本
   * @param {string[]} vers - ['unv','esv'] 之類的
   */
  this.show = function(vers){
    if ( vers != undefined ) {
      bookActived = vers
    }
    dialogBase.show()
  }


  return 
  /**
   * 
   * @param {JQuery} jq 
   * @param {string} gp - group: en fo hg mh ch en ot 等字眼
   */
  function hideAllBookItemExcludeActivedGroup(jq,gp){
    hideAllBookItemAndGroup(jq)

    // 假設只有一組 gp 成立
    var r1 = Enumerable.from( jq.find('.group') )
    .firstOrDefault(a1 => $(a1).hasClass(gp))
    if ( r1 != undefined ){
      $(r1).show() // 還原顯示
      if ( gp == 'ch' ){
        jq.find('.ch-sub').show()
      }
    }
  }
  function hideAllBookItemAndGroup(jq){
    jq.find('.group').hide()
    jq.find('.ch-sub').hide()
  }
  /**
   * 
   * @param {JQuery} jq 
   * @returns 
   */
  function fnShowed(jq){
    
    byLangActived()
      
    byBookActived()

    that.cbShowed()

    return 
    function byLangActived(){
      var r1 = Enumerable.from( jq.find('.lang-item') )
      .firstOrDefault(a1=>$(a1).data('item')['na']==langActived)
      if ( r1 != undefined ) { $(r1).trigger('click') }
    }
    function byBookActived(){
      var r2 = jq.find('.selecteds')
      r2.children().remove()

      Enumerable.from(jq.find('span.book-item'))
      .select(a1=>$(a1))
      .groupBy(a1=> bookActived.includes(a1.data('item')['na']))
      .forEach(a1=>{
        if( a1.key() ){
          a1.forEach(a2=>a2.addClass('actived'))
          
          // 最上面 Row
          a1.forEach(do1Row)

        } else {
          a1.forEach(a2=>a2.removeClass('actived'))
        }
      })
      /**
       * 原流程，額外加入這個
       * @param {JQuery} a2 - 每一個 book-item, 且是載入時, 是 actived 的 
       */
      function do1Row(a2){
        var r3 = $('<span class="book-item">'+a2.text()+'</span>')
        r3.one('click',function(){
          a2.removeClass('actived')
          r3.remove()
        })
        r2.append(r3) 
      }
    }

  }
  
  /**
   * 描述此 dialog 的 結構
   * @returns {string} 或 dom, 因為底層會對回傳值取 $(dom)
   */
  function fnRender(){
  // var re = ''
  var re = $('<div class="bible-version-choose"></div>')

  // <div class="selecteds"></div>
  re.append('<div class="selecteds"></div><br/>')

  // <div class="lang"></div>
  // <span class="lang-item" data-item={na,cna}> .cna </span>
  // ch 中文, en 英文, hg, 希伯來、希臘, fo 外語, mi 台語 ha 客語 in 台灣原著名, ot 其它
  addLangGroup(re)

  // 中文次選單 (這個注解留在 render，才會很清楚)
  // <div class="ch-sub"> ... </div> 
  // <span class="ch-sub-item actived" data="yr1800">1800前</span>
  // <span class="ch-sub-item actived" data="yr1850">1850前</span>
  ch.renderSubOptions(re)
 
  var jqChSubDiv = re.children('.ch-sub')
  var acts = ['pr','officer','ccht','study','yrnow']
  ch.setActivedOrNot(acts,jqChSubDiv)

  // <div class="group ch"></div>
  // <span class="book-item" data-item={na,cna,yr}>和合本</span>
  ch.renderBookItems(re)

  // <div class="group en hg mi ha in fo ot"></div>
  // <span class="book-item" data-item={na,cna,yr}>ESV</span>
  var engs = generateEngsItems() // english 
  var hg = generateHebrewAndGreekItems() // hebrew greek
  var mi = generateMinahItems() // Minah 閩南語
  var ha = generateHakkaItems() // Hakka 客家話
  var ind = generateIndigenousItems() // Indigenous 是原住民的意思
  var fo = generateForeignItems() // foreign 外國語
  var other = generateOtherItems() // 未分類

  Enumerable.from([
    {na:'en',items: engs},
    {na:'hg',items: hg},
    {na:'mi',items: mi},
    {na:'ha',items: ha},
    {na:'in',items: ind},
    {na:'fo',items: fo},
    {na:'ot',items: other},
  ]).forEach(a1=>{
    sortAndMapJQueryAndAppendToDiv(a1.items,a1.na,re)
  })

  modifyWithUiabvApiResults(abvRecords)
  
  return re[0];
  /**
   * 在初始 render 時，最後將名稱，換為 abvPhp 結果
   * 之所以不是取代 items ， 因為中文、非中文 有2段要處理，
   * 若加在最尾端，只要一段 code 即可
   * @param {{book:string,cname:string}[]} abvRecord 
   */
  function modifyWithUiabvApiResults(abvRecord){
    
    var r2 = Enumerable.from(re.find('.book-item'))
    .toDictionary(a1=> $(a1).data('item')['na'])

    /** @type {{book:string,cname:string}[]} */
    var news = []
    
    Enumerable.from(abvRecord).forEach(a1=>{
      var r3 = r2.get(a1.book)
      if ( r3 != undefined ){
        $(r3).text(a1.cname) // 取代名稱
        $(r3).data('item')['cna'] = a1.cname
      } else {
        news.push(a1)// 新的!! 
      }
    })

    if ( news.length != 0 ){
      var others = re.find('.group.ot')
      Enumerable.from(news).forEach(a1=>{
        var r1 = $('<span class="book-item">'+a1.cname+'</span>')
        r1.data('item',{na:a1.book,cna:a1.cname,od:100})
        others.append(r1)
      })
    }
  }

  function addLangGroup(re){
    var langs = generateLangGroup()
    var langsDom = langs.sort(a1=>-a1.od).map(a1 => {
      var r1 = $('<span class="lang-item">'+a1.cna+'</span>')
      r1.data('item',a1)
      return r1
    })
    var r2 = $('<div class="lang"></div>')
    for(var a1 of langsDom){
      r2.append(a1)
    }
    re.append(r2)
  }
  /**
   * @param {{na:string;cna:string;od:number}[]}} engs 
   * @param {string} divClassName - 例如 en
   * @param {JQuery} re - 用來 append 產生出來的 div
   */
  function sortAndMapJQueryAndAppendToDiv(engs,divClassName,re){
    var dom$s = sortAndMapJQueryObject(engs)
    var dom2 = $('<div class="group '+divClassName+'"></div>')
    for (a1 of dom$s ){
      dom2.append(a1)
    }
    re.append(dom2)
    return 
    /**
     * @param {{na:string;cna:string;od:number}[]}} engs 
     * @returns {JQuery[]}
     */
    function sortAndMapJQueryObject(engs){
      return engs.sort(a1 => -a1.od).map( a1=> {
        var r1 = $('<span class="book-item">'+a1.cna+'</span>')
        r1.data('item',a1)
        return r1
      })
    }

  }

  function generateLangGroup(){
    return [
      {na:'ch',cna:'中文',od:1},
      {na:'en',cna:'英文',od:3},
      {na:'hg',cna:'希伯來、希臘',od:5},
      {na:'fo',cna:'其它外語',od:7},
      {na:'mi',cna:'台語',od:9},
      {na:'ha',cna:'客語',od:10},
      {na:'in',cna:'台灣原著民語',od:11},
      {na:'ot',cna:'其它',od:13}
    ]
  }
  function generateEngsItems(){
    return [
      {na:'kjv', yr: 1611, cna:'KJV',od: 1},
      {na:'darby', yr: 1890, cna:'Darby',od: 3},
      {na:'bbe', yr: 1965, cna:'BBE',od: 5},
      {na:'erv', yr:1987, cna:'ERV',od: 7},
      {na:'asv', yr: 1901, cna:'ASV',od: 9},
      {na:'web',yr:2000, cna:'WEB',od: 11},
      {na:'esv',yr:2001, cna:'ESV',od: 13}
    ]
  }
  function generateHebrewAndGreekItems(){
    return [
      {na:'bhs', cna:'舊約馬索拉原文',od: 1},
      {na:'fhlwh', cna:'新約原文',od: 3},
      {na:'lxx', cna:'七十士譯本',od: 5},
    ]
  }
  function generateMinahItems(){
    return [
      {na:'tte',od:1,cna:'聖經公會現代臺語全羅'},
      {na:'ttvh',od:3,cna:'聖經公會現代臺語漢字'},
      {na:'apskcl',od:9,cna:'紅皮聖經全羅'},
      {na:'apskhl',od:11,cna:'紅皮聖經漢羅'},
      {na:'bklcl',od:13,cna:'巴克禮全羅'},
      {na:'bklhl',od:15,cna:'巴克禮漢羅'},
      {na:'tghg',od:17,cna:'聖經公會巴克禮台漢本'},
      {na:'prebklcl',od:19,cna:'馬雅各全羅'},
      // {na:'prebklhl',od:20,cna:'馬雅各漢羅'}, // 要廢棄的，因為目前漢羅轉換差異，沒辦法順利轉換
      {na:'sgebklcl',od:23,cna:'全民台語聖經全羅'},
      {na:'sgebklhl',od:25,cna:'全民台語聖經漢羅'},
    ]
  }
  function generateHakkaItems(){
    return [
      {na:'thv2e',od:5,cna:'聖經公會現代客語全羅'},
      {na:'thv12h',od:7,cna:'聖經公會現代客語漢字'},
      {na:'hakka',od:21,cna:'汕頭客語聖經'},
    ]
  }
  /**
   * Indigenous 是原住民的意思
   * @returns 
  */
  function generateIndigenousItems(){
    return [
      {na:'rukai',od:1,cna:'聖經公會魯凱語聖經'},
      {na:'tsou',od:3,cna:'聖經公會鄒語聖經'},
      {na:'ams',od:5,cna:'聖經公會阿美語1997'},
      {na:'amis2',od:7,cna:'聖經公會阿美語2019'},
      {na:'ttnt94',od:9,cna:'聖經公會達悟語新約聖經'},
      {na:'sed',od:11,cna:'賽德克語'},
    ]
  }
  function generateOtherItems(){
    return [
      {na:'tibet',od:1,cna:'藏語聖經'},
    ]
  }
  function generateForeignItems(){
    return [
      {na:'vietnamese',od:1,cna:'越南聖經'},
      {na:'russian',od:3,cna:'俄文聖經'},
      {na:'korean',od:5,cna:'韓文聖經'},
      {na:'jp',od:7,cna:'日語聖經'},
    ]
  }    
  }

  /**
   * 在 dialog 按下 close 時, 會被呼叫
   * @param {JQuery} jq 
   */
  function fnClosed(jq){
    
    var books = Enumerable.from(jq.find('span.book-item'))
    .select(a1=>$(a1))
    .where(a1=>a1.hasClass('actived'))
    .select(a1=>a1.data('item')['na']).toArray()
    if (books.length < 1 ){
      books.push('unv') 
    } 

    hideAllBookItemAndGroup(jq)
    
    that.fnClosedDialog(books)
    
  }

  /**
   * 通常呼叫 show 之後, 當 DialogBase 完成了 Append 之後會呼叫
   * 這時候就可以 registe event
   * @param {JQuery} jq 
  */
  function fnAppended(jq){
    
    jq.find('.lang-item').click(function(){
      var r1 = $(this)
      $(this).parent().children('.lang-item').removeClass('actived')
      r1.toggleClass('actived')
  
      var gp = r1.data('item').na // 'en' 'ot' 'hg' etc,
      langActived = gp // 更新，下次用

      hideAllBookItemExcludeActivedGroup(jq,gp)

      if (gp=='ch'){
        ch.showHideBook(jq)
      }
      
    })
  
    // 點選其中一個版本時
    jq.find('.book-item').on('click',function(){
      var r1 = $(this)
      r1.toggleClass('actived')

      firstRowWhenClick()

      return // click cb .book-item
      function firstRowWhenClick(){
        if ( r1.hasClass('actived') ){
          // 最上面那列，目前所選的清單
          var cna = r1.text()
          var r2 = $('<span class="book-item">'+cna+'</span>')
          r2.one('click', function(){
            r1.removeClass('actived')
            r2.remove()
          })
          jq.find('.selecteds').append(r2)
  
        } else {
          var r2 = Enumerable.from( jq.find('.selecteds').children(".book-item") )
          .firstOrDefault(a1=>$(a1).text() == r1.text())
          if ( r2 != undefined ){
            $(r2).remove()
          }
        }
      }
    })

    // 這個一定是 ch 的時候，才會發生 (因為那時候才會顯示出這些按鈕)
    jq.find('.ch-sub-item').click(function(){
      $(this).toggleClass('actived')

      if ( isTurnOnPrCcRo(this) ){
        turnOnPrCcRo(this)
      }

      ch.showHideBook(jq)

    })

    return // click function end
    /**
     * 是按下教派的其中一個按鈕嗎？(並且是開啟過程)
     * @param {HTMLElement} pthis -  
     * @returns 
     */
    function isTurnOnPrCcRo(pthis){
      var isAct = $(pthis).hasClass('actived')
      var gp = $(pthis).data('data')
      return isAct && ['cc','pr','ro'].includes(gp) 
    }
    /**
     * 按下 羅馬正教，就 dis-active 其它2個, 並不顯示選單(因為只有1個版本)
     * 按下 東正教，就  dis-active 其它2個, 並不顯示選單(因為只有1個版本)
     * 按下 基督新教，就 dis-active 其它2個, 顯示次選單, 並啟動特定選項作預設值
     * @param {HTMLElement} pthis 
     */
    function turnOnPrCcRo(pthis){
      // assert ( isTurnOnPrCcRo (this) )

      var gp = $(pthis).data('data')
      var chSub = $(pthis).parent()
      var ctrls = Enumerable.from(chSub.children('.ch-sub-item')) // children 沒加 ch-sub-item 會把 br 會拉進來
      
      // 將其它2個 dis-actived
      disActiveOther2()

      if (gp == 'cc' || gp == 'ro'){
        ctrls.skip(3).forEach(a1=>{
          $(a1).addClass('actived').hide()
        })

        chSub.find('br').hide() // 這沒加，會多了幾奇的空白
      } else {
        // assert ( gp == 'pr' )
        var r1 = ctrls.skip(3)
        r1.take(3).forEach(a1=>$(a1).addClass('actived').show()) // 打開 官話 文理 研讀
        r1.skip(3).take(4).forEach(a1=>$(a1).removeClass('actived').show()) // 除了 近代 以外的 關閉
        $(r1.last()).addClass('actived').show() // 近代，打開

        chSub.find('br').show() // 因為有可能被隱藏，所以打開換行

      }
      return 
      function disActiveOther2(){
        ctrls.take(3).forEach(a1=>{
          if ($(a1).data('data') != gp){
            $(a1).removeClass('actived')
          }
        })
      }
    }
  }


  /**
 * 開發給 BibleVersionDialog class 用
 * 中文聖經 render appended 等用途
 */
function ChineseBook() {
  var that = this
  // ['yr1800','yr1850','yr1919','yr1960','study','officer','ccht','ro','cc','pr','ubs']
  // cna: chineses name, cds: conditions, yr: year, na: name
  this.chtItems = [
    {na:'cbol',cna:'原文直譯(參考用)',cds:['yrnow','pr','officer']},
    {na:'tcv2019',cna:'現代中文譯本2019版',yr:2019,cds:['yrnow','pr','officer']},
    {na:'cccbst',cna:'聖經公會四福音書共同譯本',yr:2015,cds:['yrnow','pr','officer']},
    {na:'cnet',cna:'NET聖經中譯本',yr:2011,cds:['yrnow','pr','study']},
    {na:'rcuv',cna:'和合本2010',yr:2010,cds:['yrnow','pr','officer']},
    {na:'csb',cna:'中文標準譯本',yr:2008,cds:['yrnow','pr','officer']},
    {na:'recover',cna:'恢復本',yr:2003,cds:['yrnow','pr','officer']},
    {na:'tcv95',cna:'現代中文譯本1995版',yr:1995,cds:['yrnow','pr','officer']},
    {na:'ncv',cna:'新譯本',yr: 1992,cds:['yrnow','pr','officer']},
    {na:'lcc',cna:'呂振中譯本',yr:1970,cds:['yrnow','pr','officer','officer']},
    {na:'ofm',cna:'思高譯本',yr:1968,cds:['yrnow','cc','officer']},
    {na:'cwang',cna:'王元德官話譯本',yr:1933,cds:['pr','yr1960','officer']},
    {na:'cumv',cna:'官話和合本',yr:1919,cds:['pr','yr1960','officer']},
    {na:'unv',cna:'和合本',yr: 1911,cds:['pr','yr1919','officer']},
    {na:'orthdox',cna:'俄羅斯正教文理譯本',yr:1910,cds:['ro','yr1919','ccht'],cna2:'東正教譯本新約與詩篇'},
    {na:'cuwv',cna:'文理和合本',yr:1907,cds:['pr','yr1919','ccht']},
    {na:'wlunv',cna:'深文理和合本',yr:1906,cds:['pr','yr1960','ccht']},
    {na:'cuwve',cna:'淺文理和合本',yr:1906,cds:['pr','yr1919','ccht']},
    {na:'ssewb',cna:'施約瑟淺文理譯本',yr:1902,cds:['pr','yr1919','ccht']},
    {na:'pmb',cna:'北京官話譯本',yr:1878,cds:['pr','yr1919','officer']},
    {na:'deanwb',cna:'粦為仁譯本',yr:1870,cds:['pr','yr1919','ccht']},
    {na:'hudsonwb',cna:'胡德邁譯本',yr:1867,cds:['pr','yr1919','ccht']},
    {na:'wdv',cna:'文理委辦譯本',yr:1854,cds:['pr','yr1919','ccht']},
    {na:'goddwb',cna:'高德譯本',yr:1853,cds:['pr','yr1919','ccht']},
    {na:'nt1864',cna:'新遺詔聖經',yr:1840,cds:['pr','yr1850','ccht']},
    {na:'mormil',cna:'神天聖書',yr:1823,cds:['pr','yr1850','ccht']},
    {na:'marwb',cna:'馬殊曼譯本',yr:1822,cds:['pr','yr1850','ccht']},
    {na:'basset',cna:'白日昇徐約翰文理譯本',yr:1707,cds:['pr','yr1800',"ccht"]},
  ]
  /**
   * <div class="group ch"></div>
   * <span class="book-item" data-item={na,cna,yr}>和合本</span>
   * @param {JQuery} re - $('<div class="bible-version-choose"></div>')
   */
   this.renderBookItems = function(re){
    var re2 = $('<div class="group ch"></div>')
    for(var a1 of that.chtItems){
      var r2 = $('<span class="book-item">'+a1.cna+'</span>')
      r2.data('item',a1)
      re2.append(r2)
    }
    re.append(re2)
  }
  /**
   * 在 render 時被呼叫, 建立 按下 中文 之後 的 次選單
   * 函式中會呼叫 re.append ( )
   * @param {JQuery} re - <div class="bible-version-choose"></div>
   */
   this.renderSubOptions = function(re){
    var items = [
      {na: 'pr', cna: '基督新教'},
      {na: 'cc', cna: '羅馬天主教'},
      {na: 'ro', cna: '俄羅斯正教'},
      {na: 'officer', cna: '官話(白話文)'},
      {na: 'ccht', cna: '文理(文言文)'},
      {na: 'study', cna: '研讀本'},
      {na: 'yr1800', cna: '1800前'},
      {na: 'yr1850', cna: '1800-50'},
      {na: 'yr1919', cna: '1850-1918'},
      {na: 'yr1960', cna: '1919-60'},
      {na: 'yrnow', cna: '近代'},
      // {na: 'ubs', cna:'聯合聖經公會', cna2: '聯合聖經公會古中文系列'},
    ]
    
    var r1 = $('<div class="ch-sub"></div>')
    var r2 = items.map( a1 => {
      var r3 = $('<span class="ch-sub-item actived">'+a1.cna+'</span>')
      r3.data('data',a1.na)
      return r3
    }).forEach(a1=> r1.append(a1))
    
    r1.children(':eq(5)').after('<br/>')
    r1.children(':eq(2)').after('<br/>')

    re.append(r1)
  }
  /**
   * 與 setActivedOrNot 反過來，從 ui 取得目前 [] 
   * 這大概是在 click 任何 sub 之後，更新「哪些book-item」要顯示時會用到的
   * @param {JQuery} jqChSubDiv - jq.find('.ch-sub')
   * @returns {string[]}
   */
   this.getActivedViaDivsHasClassActived = function(jqChSubDiv){
    var re = []
    for(var a1 of jqChSubDiv.children()){
      var jqa1 = $(a1)
      if (jqa1.hasClass('actived')){
        var na = jqa1.data('data')
        re.push(na)
      }
    }
    return re
  }
  /**
   * 明顯的, 這是 '切換' 到中文時, 會被呼叫的
   * @param {string[]} acts - ["yr1800","yr1919"] 這些 ch-sub 的 key 值, 完整的是 ['yr1800','yr1850','yr1919','yr1960','study','officer','ccht','ro','cc','pr','ubs']
   * @param {JQuery} jqChSubDiv - jq.find('.ch-sub')
   */
   this.setActivedOrNot = function(acts,jqChSubDiv){    
    for (var a1 of jqChSubDiv.children()){
      var jqa1 = $(a1)
      if ( acts.includes(jqa1.data('data')) ){
        jqa1.addClass('actived')
      } else {
        jqa1.removeClass('actived')
      }
    }
  }

  /**
   * 依 ch-sub-item 來判斷，哪些 book 要顯示出來
   * @param {JQuery} jq 
   */
  this.showHideBook = function(jq){
    var conditions = that.getActivedViaDivsHasClassActived(jq.find('.ch-sub'))
    /**
     * 用在 下面流程 第2 步
     * 若 cds 有 cc yr1919 那麼, conditions 就必存存在這2個
     * 也就是說 cds = [] 時，一定成立
     * @param {string[]} cds 
     */
     var isFits = function(cds){
      return Enumerable.from(cds).all(a1=>Enumerable.from(conditions).contains(a1))
    }
    
    // 1. 取得 each span
    // 2. 哪些是 show, 哪些是 hide (以此 group 分類)
    // 3. 每 group show 或 hide 
    var r1 = $('.book-item',jq.find('.group.ch'))
    var r2 = Enumerable.from(r1)
    .select(a1=>$(a1))
    .groupBy(a1=>isFits(a1.data('item')['cds']))
    .forEach(a1=>{
      if (a1.key() ) { a1.forEach(a2=>a2.show()) }
      else { a1.forEach(a2=>a2.hide())}
    })
  }

}
}

})(this)



/**
 * This callback is when dialog closed be called
 * @callback WhenClosedCallback
 * @param {string[]} versions - 會回傳將 dialog 中所選的版本，例如 ['unv','esv']
 */

/**
 * This callback is when dialog closed be called
 * @callback FnAction
 */