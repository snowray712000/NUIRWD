"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceOther = void 0;
/**
 * 當時開發，是以 rcuv 和合本 2010 為基本開發的
 */
var ReferenceOther = /** @class */ (function () {
    function ReferenceOther(str, isGb) {
        this.str = str;
        this.isGb = isGb;
    }
    ReferenceOther.prototype.isIncludeRef = function () {
        return this.str !== undefined && /#[^\|]+\|/.test(this.str); // #路1|
    };
    ReferenceOther.prototype.toStandard = function () {
        // 全型：、點(和合本2010)． ,,, 要換回標準 :
        return this.str.replace(/(\d+)(?:．|：)(\d+)/g, function (a1, a2, a3) {
            return a2 + ":" + a3;
        });
    };
    return ReferenceOther;
}());
exports.ReferenceOther = ReferenceOther;
