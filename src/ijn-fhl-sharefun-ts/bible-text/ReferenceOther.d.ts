import { IReferenceTools } from './IReferenceTools';
/**
 * 當時開發，是以 rcuv 和合本 2010 為基本開發的
 */
export declare class ReferenceOther implements IReferenceTools {
    private str;
    private isGb;
    constructor(str: string, isGb?: 1);
    isIncludeRef(): boolean;
    toStandard(): string;
}
