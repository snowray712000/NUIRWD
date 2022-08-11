"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceNcv = void 0;
var BookNameConstants_1 = require("../bible-const/BookNameConstants");
var LQ = require("linq");
var SplitStringByRegExp_1 = require("../str/SplitStringByRegExp");
/**
 * 新譯本工具
 * （太26:26~28；可14:22~24；路22:17~20）
 * （太27:20~23、27~31；可15:6~11、16~20；路23:4、13~19）
 * （徒22:3~16，26:9~18）
 */
var ReferenceNcv = /** @class */ (function () {
    function ReferenceNcv(str, isGb) {
        this.str = str;
        this.isGb = isGb;
    }
    ReferenceNcv.prototype.isIncludeRef = function () {
        // var reg1 = new RegExp('（[徒太可路，:~；、0-9]+）','g');
        var reg1 = this.generateRegExp();
        var r2 = new SplitStringByRegExp_1.SplitStringByRegExp().main(this.str, reg1);
        this.regResult = r2;
        return LQ.from(r2)
            .select(function (a1) { return a1.exec; })
            .any(function (a1) { return a1 !== undefined; });
    };
    ReferenceNcv.prototype.generateRegExp = function () {
        if (this.isGb !== 1) {
            if (ReferenceNcv.reg === undefined) {
                ReferenceNcv.reg = g();
            }
            return ReferenceNcv.reg;
        }
        else {
            if (ReferenceNcv.regGb === undefined) {
                ReferenceNcv.regGb = g(1);
            }
            return ReferenceNcv.regGb;
        }
        function g(isGb) {
            var r1 = LQ.from(isGb !== 1 ? BookNameConstants_1.BookNameConstants.CHINESE_BOOK_ABBREVIATIONS : BookNameConstants_1.BookNameConstants.CHINESE_BOOK_ABBREVIATIONS_GB)
                .toArray()
                .join('');
            return new RegExp("\uFF08[" + r1 + "\uFF0C:~\uFF1B\u30010-9]+\uFF09", 'g');
        }
    };
    ReferenceNcv.prototype.toStandard = function () {
        if (this.regResult === undefined) {
            this.isIncludeRef();
        }
        var r2 = this.regResult;
        if (LQ.from(r2)
            .select(function (a1) { return a1.exec; })
            .all(function (a1) { return a1 === undefined; })) {
            return this.str;
        }
        return LQ.from(r2)
            .select(function (a1) { return (a1.exec === undefined ? a1.w : cvt(a1.w)); })
            .toArray()
            .join('');
        function cvt(str) {
            var r1 = str.replace(/；|，|~|、/g, function (a1) {
                if (a1 === '；') {
                    return ';';
                }
                if (a1 === '，') {
                    return ';';
                }
                if (a1 === '~') {
                    return '-';
                }
                if (a1 === '、') {
                    return ',';
                }
                return a1;
            });
            var r2splited = r1.split(/（|）/);
            return '（#' + r2splited[1] + '|）';
        }
    };
    return ReferenceNcv;
}());
exports.ReferenceNcv = ReferenceNcv;
