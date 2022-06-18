(function (root) {
    function rem2Px(rem) {
        /** @type {number?} */
        var r2;
        if (r2 == undefined) {
            getr2();
            return 16 * rem;
        }

        return r2 * rem;
        function getr2() {
            Ijnjs.testThenDo(() => {
                r2 = parseFloat($('body').css('font-size'));
            }, () => $('body').length != 0, 50);
        }
    }
    root.rem2Px = rem2Px;
})(this)

