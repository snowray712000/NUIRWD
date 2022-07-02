import { html } from "lit-html";

export function getHtmlOfDialogVersions(): string {
    // html tagFunction 概念: https://hackmd.io/7tArdINySPqH_2l51STEew?view#lit-html 
    const litObj = html`
<div id="bible-version-dialog" style="display: none;">
    <div class="selecteds" style="min-height: 2.5rem;">
        <div class="group-help">選取</div>
    </div>
    <div class="offens" style="min-height: 2.5rem;">
        <div class="group-help">常用</div>
    </div>
    <div class="sets" style="min-height: 2.5rem;">
        <div class="group-help">Sets</div>
    </div>

    <div class="lang">
        <!-- 範本，到時候裡面會被清掉 -->
        <span class="lang-item btn btn-outline-dark" data-item='{ "na":"en","cna":"中文"}'> 中文 </span>
    </div>

    <div class="ch-subs">
        <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
            <label class="form-check-label" for="flexCheckDefault">
                開啟次分類
            </label>
        </div>
        <div class="ch-sub">
            <!-- 範本，到時候裡面會被清掉 -->
            <span class="ch-sub-item btn btn-outline-dark active" data-data='pr'> 基督新教 </span>
        </div>
    </div>

    <div class="vers">
        <!-- 範本，到時候裡面會被清掉 -->
        <div class="group ch" data-lang='ch'>
            <span class="book-item btn btn-outline-dark" data-item='{}'>新譯本</span>
        </div>
    </div>
</div>
`;
    return litObj.strings[0];
}
