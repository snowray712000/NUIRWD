/// <reference path="linq.d.ts" />

var sephp = {
    /** continue search use, 不會變, 一次讀幾筆 */
    cnt_set = 15,
    /** continue search use */
    cnt_search = 0,
    /** // continue search use (所有jrets2中,且在ibooks中的) */
    Lq_ret_group = Enumerable.empty(),
    /** 使用於使用者按下 button 後繼續查詢的結果 */
    pre_search_click = (pdata) => { },
    /**
     * @param {{record:{}}[]} jrets 通常是 pre_search_sn pre_search_keyword 結果
     */
    create_dialog_presearch = (jrets) => { },
    /**
     * 
     * @param {{data:{engs:"Dna";keyword:"03478";ver:"unv"}}} pdata 
     */
    act_sn_button_click: (pdata) => { },
    /**
     * 會傳入 engs, chap, sec, ver 資訊. 通常是用來切換章節
     * 設定按下查詢之後的空白圓圈圈要作的事
     * @param {*} pdata 
     */
    act_ref_button_click: (pdata) => { },
    node_pre_search: document.getElementById("pre_search"),
    node_search_result: document.getElementById("search_result"),
    /**
     * 
     * @param {string} keyword 
     * @param {boolean} issn 
     * @param {boolean} isgb 
     * @param {SVGAnimatedString} ver 
     * @param {string} engs 
     * @param {*} isAll 
     */
    search: (keyword, issn, isgb, ver, engs, isAll) => { },
    /**
     * 用於 搜尋過程
     * @param {string} keyword 
     * @returns {0|1|2} 2:reference 1: sn keyword 0: 一般關鍵字
     */
    determine_keywordType: (keyword:string) => 0|1|2,
}