export interface IReferenceTools {
    /** 先呼叫此 */
    isIncludeRef(): boolean;
    /** 再呼叫此 */
    toStandard(): string;
}
