"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitStringByRegExp = void 0;
var matchGlobalWithCapture_1 = require("./matchGlobalWithCapture");
/** ver1版很好用, 用的時候發現, 每次用之後, 還要判斷哪個字串是符合regex的, 這樣等於多判斷一次. */
var SplitStringByRegExp = /** @class */ (function () {
    function SplitStringByRegExp() {
    }
    SplitStringByRegExp.prototype.main = function (str, reg) {
        var r1 = matchGlobalWithCapture_1.matchGlobalWithCapture(reg, str);
        // let isStartFromFirstChar = true;
        var data = [];
        if (r1.length === 0) {
            data.push({ w: str });
        }
        else {
            if (r1[0].index > 0) {
                var w = str.substr(0, r1[0].index);
                data.push({ w: w });
            }
            for (var i = 0; i < r1.length; i++) {
                var it_1 = r1[i];
                var len = it_1[0].length;
                data.push({ w: it_1[0], exec: it_1 });
                // tslint:disable-next-line: max-line-length
                var w = i !== r1.length - 1
                    ? str.substr(it_1.index + len, r1[i + 1].index - it_1.index - len)
                    : str.substr(it_1.index + len, str.length - it_1.index - len);
                if (w.length !== 0) {
                    data.push({ w: w });
                }
            }
        }
        return data;
    };
    return SplitStringByRegExp;
}());
exports.SplitStringByRegExp = SplitStringByRegExp;
