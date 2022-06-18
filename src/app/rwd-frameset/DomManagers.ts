import * as Enumerable from "linq";
declare function testThenDoAsync(args: { cbTest: () => boolean; ms?: number; msg?: string; cntMax?: number }): Promise<any>
export class DomManagers {
    static s: DomManagers = new DomManagers();
    /** 為了 scroll 內容，所以把它抓出來用，實體在 rwd-frameset */
    divContent: any
    getDivContent(): HTMLElement { return this.divContent.elementRef.nativeElement as HTMLElement; }
    divContentEachLine: any
    getDivContentEachLineResult(): any[] { return this.divContentEachLine._results as any[] }
}

/**
 * 建議配合 setTimeout 因為有時候 divEachLine 是上一時刻的
 * 但我不寫在此函式裡，比較能保持彈性
 */
export function scrollToSelected() {
    testThenDoAsync({ cbTest: () => DomManagers.s.divContentEachLine != undefined }).then(() => {
        // 如果不加 setTimeout, 取到的 divEachLine 是上一時刻的  

        var r1 = DomManagers.s.getDivContentEachLineResult()
        // console.log(DomManagers.s.divContentEachLine)
        var r2 = Enumerable.from(r1)
            .select(aa1 => aa1.nativeElement as HTMLElement)
            .takeWhile(aa1 => $(aa1).hasClass('selected') == false)
            .select(aa1 => $(aa1).height()).toArray()

        // 如果不加這個保護，如果跳到別章，當沒有 selected 的時候，卷到最後也不對
        if (r2.length != r1.length) {
            DomManagers.s.getDivContent().scrollTop = Enumerable.from(r2).sum()
        }
    })
}