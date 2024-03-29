/// <reference path="../jsDoc/jquery.js" />
/// <reference path="../jsDoc/linq.d.ts" />
/// <reference path="../ijnjs/ijnjs.d.ts" />

$(function () {    
    Ijnjs.testThenDo(()=>{
        // var len1 = '20200410a 統測105 數學B'.length
        for (const it of getDataList()) {
            $('#math105aB').append($(gHtml(it)));
        }
    })
})

function gHtml(it) {
    function isNullOrEmpty(str) {
        return str === undefined || str.length === 0;
    }

    function gArrayList_UlLi(array) {
        if (Array.isArray(array)) {

            var r4a = it.na2.map(function (a1) {
                return '<li>' + a1 + '</li>';
            }).join('');
            return re = '<span><ul>' + r4a + '</ul></span>';
        } else {
            return undefined;
        }
    }
    // <div>
    // <span>200529a_點擊節_工具隨著變</span>
    // youtube、示意圖、
    // xxxxxxxxxxxxxx<br/>xxxxxxxx
    // </div>
    var na = it.na;
    var r1 = '<span class="na">' + na + '</span><br/>';
    var r2 = !isNullOrEmpty(it.yt) ? ('<a href="' + it.yt + '" target="_blank">youtube、</a>') : '';
    // var r3 = !isNullOrEmpty(it.img) ? ('<a href="' + it.img + '" target="_blank">示意圖、</a>') : '';
    var r3 = doImgs(it.img)
    var r23 = r2 + r3;
    if (!isNullOrEmpty(r23)) r23 += '<br/>';

    var r4 = !isNullOrEmpty(it.na2) ? ('<span class="na2">' + it.na2 + '</span>') : '';
    if (Array.isArray(it.na2))
        r4 = gArrayList_UlLi(it.na2);
    // console.log(r4);

    return '<div>' + r1 + r23 + r4 + '</div>';
}
/**
 * 
 * @param {string|string[]|undefined} imgs 
 * @returns 
 */
function doImgs(imgs){
    if ( imgs === undefined ) { return ''}
    // <a href="xxxxx.jpg" target="_blank">示意圖、</a>
    if (Array.isArray(imgs)){
        return imgs.map(doImg).join('')
    } else if ( typeof imgs === 'string' ){
        return doImg(imgs)
    }
    return ''

    function doImg(img){
        var url = getServerRootDirectory(img) + img
        return generateLink(url, gPicture(url))

        function getServerRootDirectory(img){
            if ( /https?:\/\//i.test(img) ){
                return ''
            }
            return '/NUI/assets/'
        }
        function generateLink(url,innerHtml){
            return '<a href="'+url+'" target="_blank">'+innerHtml+'</a>'
        }
        function gImg(url){
            return '<img src="'+url+'" alt="點擊觀看、"  height="120"></img>'
        }
        function gPicture(url){
            // https://www.infoq.cn/article/animated-gif-without-the-gif
            var r2 = $('<picture></picture>')
            var gif = Ijnjs.Path.changeExtension(url,'.gif')
            var mp4 = Ijnjs.Path.changeExtension(url,'.mp4')
            $('<source type="video/mov" srcset="'+url+'">').appendTo(r2)
            $('<source type="video/mp4" srcset="'+mp4+'">').appendTo(r2)
            $('<img src="'+gif+'" alt="點擊觀看、" height="240">').appendTo(r2)

            
            return r2[0].outerHTML
        }
        
    }
}

function getDataList(){
    return [
        {
        na: 'dev',
        na2: [
            '最新版本 <a href="http://bible.fhl.net/NNUI/_rwd/" target="_blank">最新版本</a>',
            'dev <a href="/NNUI/_rwd_dev/" target="_blank">RD Develop versions(bkbible)</a>',
            'dev <a href="http://bible.fhl.net/NNUI/_rwd_dev/" target="_blank">RD Develop versions(bible)</a>',
            '',
        ]},{
            na: '230923a',
            na2: [
                '優化: 經文閱讀，併排時，加個細線(有時候中文太接近時，會不易分辨譯本)',
                'Bug: SnParsing，希伯來文文法重點，目前 RWD 顯示為 `備註 [#2.25#]`，應該要變成超連結，發生於創1:2',
                'Bug: SnParsing，RWD 顯示 `=`，實際應該是要顯示`διό = δι᾽ ὅ`。它的原始資料是 `remark:"<!διό!>=<!δι᾽ ὅ!>"`，發於於羅2:1',
                'Bug: SnParsing，詩篇93:3節，Bug，無顯示',
                'Bug: SNParsing。詩篇92:3，Bug，無顯示'
            ],
            img: []
        },{
            na: '230901a',
            na2: [
                '新功能: # 功能: 選擇譯本時，若在讀舊約，則不顯示沒有舊約的譯本',
                'deprecated: rxjs toPromise，用 lastValueFrom 取代',
                'deprecated: typescript substr，用 substring 取代',
                'deprecated: rxjs ConnectableObservable, multicast',
                'Bug: 譯本 Dialog 的 Opened 會被觸發兩次，已解決'
            ],
            img: []
        },{
            na: '230829a',
            na2: [
                'Bug: SNParsing，約二5節、8節沒出來。',            
            ],
            img: []
        },{
            na: '230826a',
            na2: [
                'Bug: SNParsing 中文順序標點符號錯亂。例如：`上帝說「要有光」，` 會錯誤顯示為 `，上帝說「要有光」` 的順序',
                '優化: 新譯本，詩篇96抬頭，經文交互參照，可按。將顏色從原本的紫色變為藍色。',   
                'Bug: SNParsing 的分析，於創1v11的 H9002。正確應該是 `介系詞 בְּ‎ 十 3 單陽詞尾` 但卻顯示為 `介系詞 3 十 בְּ‎ 單陽詞尾`'         
            ],
            img: []
        },{
            na: '230811a',
            na2: [
                'Bug-馬索拉原文順序上下相反',
                'ESV譯本修正',            
            ],
            img: []
        },{
            na: '230810a',
            na2: [
                'New-原文樹狀圖功能。',                
            ],
            img: []
        },{
            na: '230313',
            na2: [
                'New-併排顯示。',
                'Bug-註釋不可隨SN切換而隱藏: 創1:1，太1:1',
                'Bug-新譯本，轉換過程出現錯誤',
                'Bug-註釋同範圍,不該清除或重刷資料。',
                'Bug-註解切換下一段落時，Actived Verse不要變回該章第1節',
            ],
            img: []
        },{
            na: '210726a',
            na2: [
                'Bug-切換章節時，工具資料(Parsing or 串珠 or 註釋)不同步。',
                'Bug-點擊工具資料時，結果是「上一動作」的結果。',
                'New-顯示「目前選取經文」。',
                'New-點擊工具資料時，經文顯示區，會自動卷動卷軸。',
                'Bug-經文顯示速度優化，從約3秒變為1秒。',
            ],
            img: []
        },{
            na: '210722a',
            na2: [
                'New-聖經版本選擇，新增分類(改由dialog方式-同 NUI 方式)',
                'New-切換繁體、簡體時，會自動重新載入 (refresh)',
                '(RD)-聖經版本選擇，與NUI版本同份原始碼',
                '(RD)-在 NUI 新增一個 ijnjs 資料夾，維護常用的 js Code，並在 RWD 版也能使用',
            ],
            img: ['img/210722a_bible_version_dialog.mov','img/210722a_switch_lang_reload.mov']
        },{
        na: '210108a',
        na2: [
            'dev <a href="/NUI/210108a_rwd/" target="_blank">210108a_rwd</a>',
            'New-中文標準譯本，紅字顯示。 201216a',
            'New-近期記錄。 201219a',
            'Bug-新譯本。顯示異常 210108a',
            'RD-函式庫。抽離 ijn-fhl-sharefun-ts 函式庫 210108a'
        ]
    },      {
        na: '201121a',
        na2: [
            'dev <a href="/NUI/201121a_rwd/" target="_blank">201121a</a>',
            'Bug-工具列顯示會擋住。 201111a',
            'New-回報工具。 201111b',            
            'New-Font Size。 201112a',
            '調整-主界面設定。 上一章下一章，換為上章下章。顯示設定，換為設定。版本換為譯本。(盡可能短) 201112a',
            '調整-Font Size經文出處。 經文出處，原本不會隨著變大變小，現在會了。 201112b',            
            '調整-ToolBar太窄時。 使用iphone4的寬度，會按不到右邊的功能切換鈕。201120a',
            '調整-左功能點擊無效。 當手機版時，右上功能開啟著，按左上功能時，會無效。(因為zindex小於右功能表單)，因此自動將右功能表收入。201120a',
            '調整-選擇書卷。選擇書卷，簡易快速，從bottom dialog改為一般 dialog，並且字大小同步於字體縮放。201120a',
            '調整-選擇書卷，自動到頁面。若目前是新約，從開始時，從新約頁面開始。201120b',
            '調整-選擇書卷，簡體與英文。若設定為簡體或英文，也會生效。201120b',
            'Bug-猶、約二、約三 經文出不來。 因為 qsb 無法取得整卷, 猶 還是要寫 猶1。 201121a',
            '簡體 關鍵字搜尋。 不只搜出來，包含「自動選分類」也要成功與繁體一致。gb的qsb.php也這次有修正(分號問題)。 201211b',
            '簡體 Reference。 和合本2010中標題中的交互參照，可以成功。 201211b',
        ]
    }, {
        na: '201029b',
        na2: [
            'dev <a href="/NUI/201029b_rwd/" target="_blank">201029b</a>',
            '201022a',
            '新增 原文滑過,一樣的會反白.',
            '201023a',
            '優化 註解「資料查詢中」. 因注解資料較大一些, 所以一開始都空空的, 會讓人以為錯誤, 因此加上「資料查詢中」',
            'Bug 初始有時沒繪圖. settimeout 後再取一次, 就能解決',
            '優化 查詢,一定顯示出處. search dialog 顯示出處,不要受設定值影響.',
            '201029b',
            '優化 上一章、下一章等工具，浮動，隨時可按。 201028a',
            '優化 parsing工具。拿掉 和合本 kjv比較，因為會原文的不會用那個。 201028b',
            '優化 parsing工具。若換行，則顯示字典(這樣畫面高度不足時，會較好對照分析)。 201028b',
            '優化 parsing工具。卷動時，下一節、上一節工具，維持同樣地方 201029a',
            'RD jquery可用。201029a',
            '優化 parsing工具。Sn可點擊查詢 201029b',
        ]
    }, {
        na: '201020a',
        na2: [
            'dev <a href="/NUI/201020a_rwd/" target="_blank">201020a</a>',
            '200910a',
            'Bug-ipad的 羅1:2-3.太1:2-4 錯誤. 書卷id會錯. 原因是 RegExp 被使用後 lastIndex 會改變, 以前有將它重置為 -1, 但實際要重置為 0. 電腦版會正確, 手機版會錯誤.',
            'Bug-ipad的 版本選擇 dialog 錯誤. 會沒有任何選項. 原因是 word-break: keep-all; 是無效的. 改正為 break-all 就可以了.(當然效果不一樣)',
            'Bug-ipad的 經文顯示 qsb api 錯誤. 要用 /json/ 不可以直接用 bible.fhl.net. 所以要用 FhlUrl 的 getJsonUrl2().',
            'Bug-ipad的 經文顯示 版本錯誤. 該顯示(和合本) 會顯示 (unv), 用 BibleVersionCache 代替早期的, 因此先後順序okay了.',
            '優化-版本選擇. 按下版本選擇的 Close, 會變成 和合本, 但使用者只是想取消, 維持原本版本而已. 改掉了 close 結果.',
            '重構-版本. 早期用id的部分,全換為unv這方式,並把相關的code移除.',
            'Bug-ipad的 Reference顯示 錯誤. 重構完「版本」, 就正確了.',
            '200926a',
            'RD. windows 電腦當機',
            '201009a',
            'RD. 於 mac 電腦修復完成(可運行)。',
            'RD. 更新 angular material. 所以改了很多 import 等屬性, 連 module 都必需明確型別。',
            'RD. 細節記載在 Readme.md',
            '201010a',
            '優化-版本. 若預設沒有版本,會跳出合和本.(之前以為成功了，實際上上平版才知道，沒有).這次真的成功了.',
            '優化-原文彙編(RD). cvt_unvAsync 10筆就會刷一次。(但結果不太有感)。',
            '201012a',
            'Bug-原文彙編. 設定kjv版時, 下次還是從unv找. 設定好像無效. 因 VerForSnSearch 寫成 VerForSearch, 所以都沒有真正寫入設定值.',
            '201015a',
            '新增-經文顯示. other的轉換，以和合本2010為開發. 有雛形了. h2 h3 u b 的 tag 都可顯示, 小括號 原文當然也是.',
            'RD(經文顯示). cvt_other, 用了 DOMParsor. 與之前不一樣開發邏輯, 且更好. 因為之前同一節多個 u, 會判斷失敗, 另外, h2裡面有換行也會失敗.(原本方法)',
            '201016a',
            '交互參照顯示. 現在 交互參照 dialog 其它版本也變漂亮了.',
            '關鍵字搜尋顯示. 現在 關鍵字搜尋 dialog 其它版本也變漂亮了.',
            '原文彙編顯示. 現在 原文彙編 dialog 變漂亮了.',
            'RD. 原文彙編核心連和合本也改 cvt_others, kjv要另外再處理一點(也包在裡面了)',
            '201016b',
            'Bug-經文顯示. KJV還有Fo沒處理到.',
            'Bug-搜尋死當. 當關鍵字搜尋，多打一個空白，就會造成死當. 在keyword加trim()除掉空白即可.',
            'RD-重構主顯示. 現在 unv, kjv 正式皆用 cvt_others.',
            'RD-QSB不一致. 現在交互參照、關鍵字搜尋也都加入 strong=1 來取資料，否則許多格式都會被掉去.',
            '201020a',
            '新增-注腳顯示. cnet 與 中文標準譯本.',
        ]
    }, {
        na: '200907a',
        na2: [
            'dev <a href="/NUI/200907a_rwd/" target="_blank">200907a</a>',
            '200827a',
            'Bug-原文字典-twcb。浸宣原始資料是html，透過DOMParser後，將不會再出現div這些不該出現的東西了。',
            '承上。原文字典,字眼class是exp的，會被畫成紫色。',
            '優化-原文彙編。kjv版本也可以了，但和合本2010還不行(api不支援)。',
            '200903a',
            'RD 優化-原文編號按鈕。設定拉到主畫面較方便。',
            'RD UnitTest-dlines-rendors, 如此, 主畫面、搜尋結果、都可以用一致的顯示了',
            'RD重構-LocalStorageXXXXXBase系列, String, boolean, array。',
            'RD重構-dlines-rendors, 如此, 主畫面、搜尋結果、都可以用一致的顯示了',
            '200904a',
            '新增-交錯顯示經文ok(合和本、新譯本、KJV、cbol)',
            '變更-聖經版本選擇，改為 dialog。',
            '200907a',
            'RD修復-上一頁、下一頁。因為主畫面換為交錯式而出現的。',
            'RD修復-事件Base判斷，Array與JSON判斷是錯的，要用DeepEqual，而非直接等於。',
            'RD-使用 changed$事件時，可能static還沒初始化好，因此放在 setTimeout 中最保險。',
            '優化-click event 若功能沒展開，則不要一直取api(降低負荷)。',
            'RD修復-原本的 EventTool 加上 multicast, 可多人等候。不然上述功能切換只能一個成功。(https://youtu.be/3uuPN9BDyho)',
            '重構-click event 換為統一的事件方式(與LocalStorageBase的)。',
        ]
    }, {
        na: '200821d_',
        na2: [
            '搜尋功能優化 <a href="/NUI/200821a_rwd/" target="_blank">200821a,b,c,d</a>',
            '200821a_ReferenceDialog 可切換版本',
            '200821b_SearchDialog 切換版本改用 dialog',
            '200821c_原文彙編Dialog 切換版本改用 dialog',
            '200821d_Reference Dialog 顯示, 使用 padding-left 與 text-indent.',
        ]
    }, {
        na: '200820d_',
        na2: [
            '搜尋功能優化 <a href="/NUI/200820a_rwd/" target="_blank">200820a,b,c,d</a>',
            '(RD)新增-仿qunits。/#/qunit/',
            '(RD)重構-注釋顯示。用dtexts-render 取代原來的 com-text InfoDialogComponent',
            '(RD)說明文件(注釋開發)- https://youtu.be/K7ehx-0czG0',
            'b',
            '(RD)移除-DialogRefOpenor DialogOrigDictOpenor DialogSnDictOpenor InfoDialogComponent ComTextComponent',
            'c',
            '優化-注釋間格。比較美，不會太擠。',
            'd',
            '新增-注釋原文字典。SNH00021、SNG00021、H0021、G0021都可以用。',
        ]
    }, {
        na: '200806c_搜尋功能-原文字典排版優化',
        na2: [
            '搜尋功能優化 <a href="/NUI/200806a_rwd/" target="_blank">200806c(毀損)</a>',
            '優化-CBOL 中文、英文、新約、舊約的排版，已經按 ol li 方式產生. (dtexts-rendor-components, 且用到遞迴)',
            'b,',
            '優化-搜尋後,多了 close 鈕按, (iphone手機沒有返回前頁的功能,若填滿沒地方好按掉,也沒esc鍵好用)',
            '優化-原文字典查詢後,能按上一個、下一個原文.(也方便測試)',
            '優化-預設聖經版本,當載入時,沒版本的時候',
            '優化-預設載入第1個節的注釋相關內容,當載入時,沒版本的時候.',
            'c,',
            '重構,共用 - parsing 與 搜尋共用.(DialogSnDictOpenor DialogOrigDictOpenor 預備被拿掉)',
            '重構,共用 - 串珠 與 搜尋共用. (DialogRefOpenor 預備被拿掉)',
            '重構,共用 - 經文主體、顯示部分 與 搜尋共用. (DialogRefOpenor DialogOrigDictOpenor)',
            '新增-下一章、上一章.',
        ]
    }, {
        na: '200730b_搜尋功能,原文彙編',
        na2: [
            '搜尋功能優化 <a href="/NUI/200730a_rwd/" target="_blank">200730a</a>',
            'Bug-修正, 查詢預設版本無效.(因為localStorage若不存在是回傳null, 不是 undefined)',
            '新增-上色開關, 在作pptx的時候,若查詢關鍵字被上色很麻煩',
            '新增-Reference版本, 查詢聖經版本設定後, Reference應該也要連動用那個版本',
            'BUG-修正, 手機版本,會把右邊功能按鈕擠掉, 按不到, 因為input太寬了. (手機版, 設8em, 以 iphon se)',
            '新增-Reference時, 當想此Ref的注釋,原文,地圖等等, 有「切換網址」就不用手動輸入了. ',
            'BUG-修正 查詢G81, 然後再按 彼前2:17,5:9 會錯. (原因, qsb api 跨章要用;來取代,即可) ',
            '新增-原文彙編, 原文查詢後, 可再查彙編. (書卷統計可與keyword查詢共用)',
            '(RD)-原文彙編, 上色時, sn雖是85, 但經文是085, 所以會沒上到, 注意.',
            '(RD)-原文彙編, 版本清單,要支援sn的,所以要另外一個全域變數,供sn用.(和合本2010其實有,但不全都有)',
            'BUG-修正, 搜尋輸入 版本不知道為何不見了.(因為.ts改變數名稱,但html沒同步改)',
            'BUG-修正, 搜尋輸入 林後2, 按下「切換網址」卻跑到 http://bible.fhl.net/#/bible/林後2, 應該要到 bible.fhl.net/NUI/200730a_rwd/#/bible/林後2 (加上window.location.pathname 指向 html 的路徑)',
        ]
    }, {
        na: '200729a_搜尋功能-加上書卷分類',
        na2: [
            '搜尋功能優化 <a href="/NUI/200729a_rwd/" target="_blank">200729a</a>',
            '搜尋關鍵字後, 可以有書卷分類',
            'Bug-修正, 手機版查詢後, 拉到底會被遮住(讓它不換行)',
            'Bug-修正, 查詢後, 若0筆, 或不正確, api 會回傳 null, 造成錯誤.',
            'Bug-修正, 查詢後, 分類0筆還是顯示, 拿掉它.',
            'Bug-修正, 查詢後, 若0筆, 什麼都不顯示, 就不能「設定」了, (data.length!==0拿掉)',
        ]
    }, {
        na: '200727a_搜尋功能',
        na2: [
            '新增 - 搜尋功能 <a href="/NUI/200727a_rwd/" target="_blank">200727a</a>', '可搜尋關鍵字, 原文字典, 參考經文', '原文字典包含了 浸宣 與 CBOL 版內容'
        ]
    }, {
        na: '200619b_浸宣舊約原文字典上線',
        na2: [
            '新增 - 浸宣舊約原文字典上線.', '(Bug) 地圖、相片會出不來，先拿掉。 #平板', '(Bug) 切換書卷章節不正常。 #平板', '(Bug修復) - 舊約Sn Click正確。'
        ]
    }, {
        na: '200619a_高度自動對齊',
        na2: ['高度自動對齊, 當視窗改變, 版本數量改變, Sn開關改變, 手機旋轉, 都會重新計算', '(RD) 新增了 EventVerseChanged, 這個可以任何地方使用 left right 開啟/關閉 事件.', '(RD) 新增了 EventVersionsChanged, 可任何地方使用 versions changed', '(RD) 新增了 EventWindowSizeChanged, 可任何地方使用, 手機旋轉也會觸發這個', '(RD) 新增了 EventWindowSizeChanged, 可任何地方使用, 手機旋轉也會觸發這個', '(RD技術) 原生訊息, 要透過 fromEvent 才能夠有一個以上訂閱. 例 window resize', '(RD技術) debounceTime 不錯, 若訊息異常密集, 可以用這個, 100ms 內, 只允許一個.']
    }, {
        na: '200611a_高度計算case都對',
        na2: [
            '',
            '(RD) 高度計算case都對了, HeightCalc class 為核心.',
            '(RD) 這個很複雜, 使用了 unit test 方式開發.',
            '(RD) linq_sum linq_max 新增.',
            '(RD) 還有統一了 linq_xxx 命名方式.',
            '(RD) address 可以 less than; greater than.',
        ],
    }, {
        na: '200608a_原文直譯參考',
        na2: [
            '原文直譯版本已完成',
            '(RD) 文字有換行符號, 換行\\r\\n 版本',
            '(RD) (原文3:1) 就是內容, 不用 parsing',
            '(RD) 有全型小括號、半型小括號 兩種',
        ],
    }, {
        na: '200606a_Bug_經文點擊後,工具跳至對應節失效',
        na2: [
            '已修復',
            '(RD) 重構 VerseAddress 與 DAddress 時造成的.',
        ],
    }, {
        na: '200605a_新譯本',
        na2: [
            '標題處理/括號處理/併入上節/標題後換行/參考經文',
            '可從 <a href="/NUI/_rwd/#/bible/Ps1:1.3:1-2.14:1.16:9.18:1.Mr14:3.16:1.Lu1:74-75">體會</a>',
            '(RD) 括號較麻煩的是處理到雙層括號',
            '(RD) 新譯本的參考，特別處, 是用~, 不是用-, 是用；。，, 不是用;, 有時會加「參」這個字',
        ],
    }, {
        na: '200604c_和合本全型小括號',
        na2: [
            '可能是（或譯），也可能是標題（詩篇）',
            '可從 <a href="/NUI/_rwd/#/bible/Ps8:6-9.60:1-2.92:1-4.Ps8:8">體會</a>'
        ],
    }, {
        na: '200604b_和合本_併入上節',
        na2: [
            '如詩篇8就可以看到',
            '(RD) 經文內容為 \'a\' 時',
        ],
    }, {
        na: '200604a_重構_經文轉換',
        na2: [
            '(RD) 轉換一致用 DText class, DOneLine class ',
            '(RD) 任何轉換都是一個 IAddBase interface ',
        ],
    }, {
        na: '200603d_重構_砍碼_去掉cbol-dict_抽出info-dialog',
        na2: [
            '對使用者無變化.',
            '(RD) 相關 class 移除 cbol-dict class',
            '(RD) 相關 class 抽出 info-dialog',
        ],
    }, {
        na: '200603c_重構_砍碼_addr統一_去掉起初動態元件',
        na2: [
            '對使用者無變化.',
            '(RD) 將VerseAddress統一為 DAddress, 因此 DAddress 多了 ver?.',
            '(RD) 最初動態產生概念不需要.',
            '(RD) 相關 class 移除 one-chap one-verse show-base 相關',
        ],
    }, {
        na: '200603b_Bug_Sn非純數字時',
        na2: [
            'SN若是 5608a 會錯, 因為原本假設是純數字. #羅5;6|會正常',
            '承上, 例子為 #Mt6:8.6:18.14:1.Ro9:27|',
        ],
        // img: 'https://photos.google.com/album/AF1QipNcOo9KfTVF1bKt1vAzAWxoVay7e15D6HYKFve8/photo/AF1QipM1qQ5ktZonwZ-s-USlKwfwmSsJMbL8QLMS2LoH'
    }, {
        na: '200603a_Bug_Ro5無法顯示',
        na2: [
            '看#羅5|,會沒畫面,#羅5;6|會正常',
            '(RD) 因為sobj.php 沒資料時, 沒作保護.',
            '(RD) 重構新增 AddMapPhotoInfo class',
            '(RD) 之前為測試,bkbible較慢,把其引到bible domain,但 sbdag 會有 cross-origin 問題, 因此此api維持在 bkbible(若是在 bkbible測試時, 當然,若在bible就還是bible domain) ',
        ],

    }, {
        na: '200530a_章節描述end或e',
        na2: [
            '經文連結,可輸入 1:5-end 或 1:5-e 或 1:1-2:end 或 1:1-2:e',
            '(RD)承上, 關鍵 class SmartDescriptEndParsing',
            '(RD)若是bkbible, api 會到 bible 而非相對路徑',
            '(RD)承上,因為開發上傳後測試,需一段時間才能用bible.fhl.net測試',
        ],
        // img: 'https://photos.google.com/album/AF1QipNcOo9KfTVF1bKt1vAzAWxoVay7e15D6HYKFve8/photo/AF1QipNyMUcNaHzcjVKg378J2nLMLSo2ypZZXHKrEVIl',
    }, {
        na: '200529a_點擊節_工具隨著變',
        na2: ['點擊經文時,串珠,原文解析,註釋會跳至點擊的節', '如示意圖所示', '新增版本清單列表'],
        // img: 'https://photos.google.com/share/AF1QipMUkD8PbUam8ix8qOYptdODtcFJjxU9l2J6YVX-aSrk9pIjCTJP7vXb2PYfbUPFnA/photo/AF1QipOLyoWfJqwFsP3F4nBthHis1EnglEsjis6YougY?key=RGdBMUoyRzc0T2Flb2JUOW5YRm03WmZKRHFaOGlR',
    }, {
        na: '200528a_Sn_地理_相片開關',
        // img: 'https://photos.google.com/album/AF1QipNcOo9KfTVF1bKt1vAzAWxoVay7e15D6HYKFve8/photo/AF1QipMTRckQ-oKExJrilBGMe-G44O4C60eEewy_FWxs',
    }, {
        na: '200527a_顯示不換行_交錯_前後',
        na2: ['整段顯示方式', '交錯顏色', '經文位置顯示在前或在後(但還沒開放設定)'],
        // img: 'https://photos.google.com/album/AF1QipNcOo9KfTVF1bKt1vAzAWxoVay7e15D6HYKFve8/photo/AF1QipPtNcrKa8WpxUzG13CY8rHvSB5yKOkdM6aDXTI6',
    }, {
        na: '200522a_地圖相片marker',
        na2: ['地圖/相片的marker', '(RD)使用 background image 好處: 複製經文時不會複製到圖唷!!!'],
    }, {
        na: '200521c_一版本經文顯示',
        na2: ['可顯示SN', '(RD)取得 qsb api 結果, parsing 經文與SN.', '(RD)one-ver-component']
    },]
}