import { IReferenceTools } from './IReferenceTools';
/**
 * 新譯本工具
 * （太26:26~28；可14:22~24；路22:17~20）
 * （太27:20~23、27~31；可15:6~11、16~20；路23:4、13~19）
 * （徒22:3~16，26:9~18）
 */
export declare class ReferenceNcv implements IReferenceTools {
    protected regResult?: {
        w: string;
        exec?: RegExpExecArray;
    }[];
    private str;
    private isGb;
    private static reg;
    private static regGb;
    constructor(str: string, isGb?: 1);
    isIncludeRef(): boolean;
    private generateRegExp;
    toStandard(): string;
}
