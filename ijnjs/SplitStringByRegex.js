    /**
     * 應用1
     * 在處理希伯來原文的時候，原文與中文會夾雜出現，希伯來文的字型通常要很大，而中文的字型不要很大，分離出來才能夠各別設定 font-size
     */
(function(root,undefined){
    root.exportsijn = SplitStringByRegex 
    return
    /** 
     * 因為 string.split 不夠我使用，所以開發一個 regex 的來用
     * @example
     * // 12321
     * new SplitStringByRegex().main("取出eng的word",/\w+/ig)
     * @class
    */
    function SplitStringByRegex () {
        
        /** 
         * 若沒有符合 Regex，仍然會回傳 [{w:str}]
         * @param {string} str asfwefwe
         * @param {Split} reg fwefwaefwf
         * @returns {{w:string; exec?:RegExpExecArray }[]}
        */
        this.main = function (str, reg) {
            var r1 = matchGlobalWithCapture(reg, str)
            
            /** @type {{w:string; exec?:RegExpExecArray}[]}*/
            var data = []

            if ( r1.length == 0){
                data.push({w: str})
            } else {
                if (r1[0].index > 0){
                    var w = str.substr(0, r1[0].index)
                    data.push({ w: w})
                }

                var cnt = r1.length
                r1.forEach(function(it,i){
                    data.push({w: it[0], exec: it})
                    
                    var isLast = i == cnt - 1
                    var len = it[0].length
                    var w = !isLast ? str.substr(it.index + len, r1[i + 1].index - it.index - len) : str.substr(it.index + len, str.length - it.index - len);
                    if ( w.length != 0){
                        data.push({w: w})
                    }
                })
            }

            return data
            /** 
             * js global 的 exec 我覺得不直覺，所以寫一個 exec global 版的
             * @param {RegExp} reg reg 若非 global 會自動變為 global, 但我不能幫你變, 因為這是唯讀
             * @param {string} str
             * @returns {RegExpExecArray[]}
            */
            function matchGlobalWithCapture(reg, str){
                if (reg.global == false){
                    throw "reg must global."
                }
                
                reg.lastIndex = 0 // reset

                var re = []
                /** @type {?RegExpExecArray} **/
                var r1 
                while ( (r1 = reg.exec(str)) !== null ){{
                    re.push(r1)
                }}

                reg.lastIndex = 0 // reset

                return re
            }       
        }
    }
})(this)
    
