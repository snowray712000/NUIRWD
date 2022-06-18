(function (root) {
    function assert(cbTest, msg) {
        if (typeof cbTest === 'function') {
            if (false == cbTest()) {
                throw Error(getMsg());
            }
        } else if (typeof cbTest === 'boolean') {
            if (false == cbTest) {
                throw Error(getMsg());
            }
        }
        function getMsg() {
            if (msg != undefined) {
                return msg;
            }
            if (typeof cbTest === 'function') {
                return 'assert ' + cbTest.toString();
            }
            return 'assert fail.';
        }
    }
    root.assert = assert;
})(this)

