"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ncv_1 = require("./ncv");
var ReferenceNcv_1 = require("./ReferenceNcv");
test('ncv reference is included', function () {
    expect(ncv_1.isIncludeReference('林前11 要用合適的態度吃主的聖餐（太26:26~28；可14:22~24；路22:17~20）')).toBe(true);
    expect(ncv_1.isIncludeReference('林前11 要用合適的態度吃主的聖餐')).toBe(false);
    expect(ncv_1.isIncludeReference('約18 彼拉多判耶穌釘十字架（太27:20~23、27~31；可15:6~11、16~20；路23:4、13~19）')).toBe(true);
    expect(ncv_1.isIncludeReference('徒 9 掃羅悔改歸主（徒22:3~16，26:9~18）')).toBe(true);
});
test('ncv reference to standard', function () {
    expect(ncv_1.toStandardReference('林前11 要用合適的態度吃主的聖餐（太26:26~28；可14:22~24；路22:17~20）')).toBe('林前11 要用合適的態度吃主的聖餐（#太26:26-28;可14:22-24;路22:17-20|）');
    expect(ncv_1.toStandardReference('林前11 要用合適的態度吃主的聖餐')).toBe('林前11 要用合適的態度吃主的聖餐');
    expect(ncv_1.toStandardReference('約18 彼拉多判耶穌釘十字架（太27:20~23、27~31；可15:6~11、16~20；路23:4、13~19）')).toBe('約18 彼拉多判耶穌釘十字架（#太27:20-23,27-31;可15:6-11,16-20;路23:4,13-19|）');
    expect(ncv_1.toStandardReference('徒 9 掃羅悔改歸主（徒22:3~16，26:9~18）')).toBe('徒 9 掃羅悔改歸主（#徒22:3-16;26:9-18|）');
});
test('ncv reference 多處', function () {
    expect(ncv_1.isIncludeReference('林前11 要用（太26:26~28；可14:22~24；路22:17~20）兩處（太26:26~28；可14:22~24；路22:17~20）')).toBe(true);
    expect(ncv_1.toStandardReference('林前11 要用（太26:26~28；可14:22~24；路22:17~20）兩處（太26:26~28；可14:22~24；路22:17~20）')).toBe('林前11 要用（#太26:26-28;可14:22-24;路22:17-20|）兩處（#太26:26-28;可14:22-24;路22:17-20|）');
});
test('ncv reference Bug Case', function () {
    var r1 = new ReferenceNcv_1.ReferenceNcv('（太26:26~28；可14:22~24；路22:17~20）');
    expect(r1.isIncludeRef()).toBe(true);
    expect(r1.toStandard()).toBe('（#太26:26-28;可14:22-24;路22:17-20|）');
});
