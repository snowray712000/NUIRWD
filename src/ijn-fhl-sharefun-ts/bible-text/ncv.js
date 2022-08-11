"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toStandardReference = exports.isIncludeReference = void 0;
var ReferenceNcv_1 = require("./ReferenceNcv");
function isIncludeReference(str, isGb) {
    return new ReferenceNcv_1.ReferenceNcv(str, isGb).isIncludeRef();
}
exports.isIncludeReference = isIncludeReference;
function toStandardReference(str, isGb) {
    return new ReferenceNcv_1.ReferenceNcv(str, isGb).toStandard();
}
exports.toStandardReference = toStandardReference;
