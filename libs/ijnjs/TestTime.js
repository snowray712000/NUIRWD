(function (root) {
    // debug 過程，要用
    function TestTime(isLog) {
        isLog = isLog == undefined ? false : isLog;
        var ts = new Date();
        /**
         * @param {string} msg
         * @param {boolean} isReset
         */
        this.log = function (msg, isReset) {
            if (isLog == false) { return; }
            isReset = isReset == undefined ? true : isReset;
            var te = new Date();
            var dt = te - ts;
            console.log(msg + ' ' + dt + ' ms.');
            if (isReset)
                ts = te;
        };
    }
    root.TestTime = TestTime;
})(this)