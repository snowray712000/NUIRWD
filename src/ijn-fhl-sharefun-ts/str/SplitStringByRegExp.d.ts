/** ver1版很好用, 用的時候發現, 每次用之後, 還要判斷哪個字串是符合regex的, 這樣等於多判斷一次. */
export declare class SplitStringByRegExp {
    main(str: string, reg: RegExp): {
        w: string;
        exec?: RegExpExecArray;
    }[];
}
