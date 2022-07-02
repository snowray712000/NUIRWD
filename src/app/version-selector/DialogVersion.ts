import { sleepAsync } from "../tools/sleep";
import "jquery"
import "jquery-ui"
import * as Enumerable from "linq";
import { getHtmlOfDialogVersions } from "./getHtmlOfDialogVersions";
import { constants } from "./ConstantsUsingByDialogVersion";


export interface DDialogOfVersionArgs {
    selects?: string[];
    offens?: string[];
    sets?: string[][];
}

export class BibieVersionDialog {
    private constructor() { }
    private static _s: BibieVersionDialog = null;
    static get s(): BibieVersionDialog {
        if (this._s == null) {
            this._s = new BibieVersionDialog();
        }
        return this._s
    }
    // 將 jquery .data 用到的 轉為明確顯態
    // dlg$.data('data')
    private get dlg$Data(): DDialogOfVersionArgs {
        return this.dlg$.data('data');
    }
    // 將 jquery .data 用到的 轉為明確顯態
    // dlg$.data('data', jo)
    private set dlg$Data(data: DDialogOfVersionArgs) {
        this.dlg$.data('data', data)
    }
    // open 時會被呼叫，第1次
    private async initAsync() {
        await this.makeSureDialogExistAsync()
        await this.setWidthHeightAsync()

        this.render()
        this.registerEvent()

        this.triggerClickFirstItemOfLanguage();
        this.triggerClickFirstItemOfChineseSubOptions();
    }
    // 模擬點擊 語言 選項中的第1個, 即 中文
    // 只有第1次，初始化 dialog 時才會用。
    private triggerClickFirstItemOfLanguage() {
        const { lang$ } = this.dlgs$
        lang$.find('.lang-item').eq(0).trigger('click')
    }
    // 模擬點擊 語言 次選項中的第1個, 即 基督新教 
    // 只有第1次，初始化 dialog 時才會用。
    private triggerClickFirstItemOfChineseSubOptions() {
        const { chSub$ } = this.dlgs$
        chSub$.children().eq(0).trigger('click')
    }
    public setCallbackClosed(cb: (jo?: DDialogOfVersionArgs) => void) {
        this._cbClosed = cb;
    }
    // 第1次，會是 async，之後不會 
    public async openAsync(joArgs?: DDialogOfVersionArgs) {
        if (this.dlg$.length == 0) {
            await this.initAsync();
            await this.openAsync(joArgs);
            return;
        }

        defaultJo(); // maybe change joArgs                
        this.dlg$Data = joArgs;
        this.dlg$.dialog("open")
        this.triggerCbOpened();
        return
        function defaultJo() {
            const def = {
                selects: ['unv'],
                offens: ['cbol', 'esv'],
                sets: [['unv', 'kjv', 'esv', 'cbol'], ['unv', 'esv']]
            }

            if (joArgs == undefined) { joArgs = {} }
            if (joArgs.selects == undefined) { joArgs.selects = g(def.selects) }
            if (joArgs.offens == undefined) { joArgs.offens = g(def.offens) }
            if (joArgs.sets == undefined) { joArgs.sets = g(def.sets) }

            return
            function g(ja) {
                /** @type {string[]} */
                var r = []
                for (var a of ja) { r.push(a) }
                return r
            }
        }
    }
    private id = "bible-version-dialog"
    private _cbClosed: (jo?: DDialogOfVersionArgs) => void;
    private _cbOpened: () => void;
    private triggerCbOpened() {
        if (this._cbOpened == null) {
            console.log('_cbOpened triggered. you cant set custom callback.')
        }
        else {
            this._cbOpened();
        }
    }
    private triggerCbClosed() {
        const jo = this.getSelectsAndOffensAndSets()
        if (this._cbClosed == null) {
            console.log('_cbClosed triggered. you cant set custom callback.')
        } else {
            this._cbClosed(jo)
        }
    }

    private get dlg$(): JQuery<HTMLElement> {
        return $("#" + this.id)
    }
    // 可使用 const { sets$ } = this.dlgs$ 選，要用的
    private get dlgs$() {
        const dlg$ = this.dlg$
        const selecteds$ = dlg$.find('.selecteds')
        const offens$ = dlg$.find('.offens')
        const sets$ = dlg$.find('.sets')
        const lang$ = dlg$.find('.lang')
        const chSubs$ = dlg$.find('.ch-subs')
        const flexCheckDefault$ = chSubs$.find('#flexCheckDefault')
        const chSub$ = dlg$.find('.ch-sub')
        const vers$ = dlg$.find('.vers')
        return {
            dlg$,
            selecteds$,
            offens$,
            sets$,
            lang$,
            chSubs$,
            flexCheckDefault$,
            chSub$,
            vers$
        }
    }
    private getDom$OfSpanOfSet(domOfSet: HTMLElement) {
        return $(domOfSet).data('dom$') as unknown as JQuery<HTMLElement>[]
    }
    private registerEvent() {
        const that = this
        const { lang$, flexCheckDefault$, chSub$, vers$, offens$, sets$, selecteds$, chSubs$ } = this.dlgs$

        lang$.find('.lang-item').on('click', function () {
            var this$ = $(this)
            var isOrignal = this$.hasClass('active')
            if (isOrignal) {
                return
            }

            lang$.children().removeClass('active')
            this$.addClass('active')


            var lang = this$.data('data').na

            if (lang == 'ch') {
                chSubs$.show()
            } else {
                chSubs$.hide()
            }

            for (var a1 of vers$.children()) {
                if (lang != $(a1).data('lang')) {
                    $(a1).hide()
                } else {
                    $(a1).show()
                }
            }

            if (lang == 'ch') {
                flexCheckDefault$.trigger('change')
            }
        })

        addChineseSubOptions()

        flexCheckDefault$.on('change', function () {
            var isChk = $(this).is(":checked")
            if (isChk) {
                chSub$.show()
                filterChineses()
            } else {
                chSub$.hide()
                vers$.children('.ch').children().show() // true -> false, 全變 visible
            }
        })

        // selects 中的 help (清除所選)
        selecteds$.children('.group-help').on('click', function () {
            Enumerable.from(selecteds$.children('span')).reverse().select(a1 => $(a1).data('dom$')).forEach(a1 => a1.trigger('click'))
        })

        // offen 中的 help (清除常用)
        offens$.children('.group-help').on('click', function () {
            offens$.children('span').remove()
        })

        // sets 中的 help (清除常用)
        sets$.children('.group-help').on('click', function () {
            sets$.children('span').remove()
        })

        // selecteds$ 中的 span
        selecteds$.on({
            click: function () {
                $(this).data('dom$').trigger('click')
            }
        }, 'span')

        // offen 中的 span
        offens$.on({
            click: function () {
                $(this).data('dom$').trigger('click')
            }
        }, 'span')

        // sets$ 中的 span 
        sets$.on({
            click: function () {
                const dom = this as unknown as HTMLElement;

                // 清除 selects 中目前的 (用點擊模擬達成，這樣程式碼才會重複使用)
                Enumerable.from(selecteds$.children('span')).reverse().forEach(a1 => $(a1).trigger('click'))

                // 點擊選取順序
                Enumerable.from(that.getDom$OfSpanOfSet(dom))
                    .forEach(a1 => a1.trigger('click'))
            }
        }, 'span')

        // 任何一版本 vers 中的 .book-item
        vers$.on({
            click: function () {
                var this$ = $(this)
                this$.toggleClass('active')

                var data = this$.data('data')
                if (this$.hasClass('active')) {
                    addItem(data, this)
                } else {
                    removeItem(data, this)
                }
            }
        }, '.book-item')

        return
        /**
         * 
         * @param {{na:string;cna:string}} data 
         */
        function addItem(data, pthis) {
            addToSelected()
            removeIfOffenExist()
            return
            function addToSelected() {
                var r1 = $('<span>', {
                    class: 'btn btn-outline-primary',
                    text: data.cna
                }).data('data', data)
                    .data('dom$', $(pthis))
                    .appendTo(selecteds$)
            }
            function removeIfOffenExist() {
                var r1 = Enumerable.from(offens$.children('span'))
                    .firstOrDefault(a1 => $(a1).data('data').na == data.na)
                if (r1 != undefined) { $(r1).remove() }
            }
            // <button type="button" class="btn btn-outline-primary">Primary</button>
        }
        /**
         * 
         * @param {{na:string;cna:string}} data 
         */
        function removeItem(data, pthis) {
            removeIfSelectedExist()
            addToOffens()
            return
            function removeIfSelectedExist() {
                var r1 = Enumerable.from(selecteds$.children('span'))
                    .firstOrDefault(a1 => $(a1).data('data').na == data.na)
                if (r1 != undefined) { $(r1).remove() }
            }
            function addToOffens() {
                $('<span>', {
                    class: 'btn btn-outline-secondary btn-sm',
                    text: data.cna
                }).data('data', data)
                    .data('dom$', $(pthis))
                    .prependTo(offens$)
                offens$.children(':gt(10)').remove()
            }
        }
        function addChineseSubOptions() {
            // chSub$.children() 還包含 br , 這是易出錯的 bug
            var chSubOpts$ = chSub$.children('span')
            var optsSkip3$ = chSubOpts$.filter(':gt(2)')

            chSubOpts$.eq(0).on('click', function () {
                // 基督新教
                var isOri = $(this).hasClass('active')
                if (isOri == true) { return }

                setClass012(0)
                for (var a1 of [3, 4, 5, 10]) {
                    chSubOpts$.eq(a1).addClass('active')
                }
                optsSkip3$.show()
                flexCheckDefault$.trigger('change')
            })
            chSubOpts$.eq(1).on('click', function () {
                // 天主教
                var isOri = $(this).hasClass('active')
                if (isOri == true) { return }

                setClass012(1)
                optsSkip3$.hide()
                flexCheckDefault$.trigger('change')
            })
            chSubOpts$.eq(2).on('click', function () {
                // 東正教
                var isOri = $(this).hasClass('active')
                if (isOri == true) { return }

                setClass012(2)
                optsSkip3$.hide()
                flexCheckDefault$.trigger('change')
            })
            optsSkip3$.on('click', function () {
                $(this).toggleClass('active')
                flexCheckDefault$.trigger('change')
            })
            return
            function setClass012(i) {
                for (var a of [0, 1, 2]) {
                    if (a == i) {
                        chSubOpts$.eq(a).addClass('active')
                    } else {
                        chSubOpts$.eq(a).removeClass('active')
                    }
                }
            }
        }
        /** 被 checked box change 呼叫 */
        function filterChineses() {
            vers$.children('.ch').children().hide()

            var cds = getConditions()
            for (var a1 of vers$.children('.ch').children()) {
                var a1$ = $(a1)
                if (isFit()) {
                    a1$.show()
                } else {
                    a1$.hide()
                }
                continue;

                function isFit() {
                    /** @type {string[]} */
                    var r2 = a1$.data('data').cds
                    for (var a2 of r2) {
                        if (cds.includes(a2) == false) {
                            return false
                        } // 任一個條件不成立，則不顯示
                    }
                    return true
                }
            }

            return
            function getConditions() {
                /** @type {string[]} */
                var re = []
                for (var a1 of chSub$.children(".active")) {
                    re.push($(a1).data('data'))
                }
                return re
            }
        }
    }
    private render() {
        const { lang$, chSub$, vers$ } = this.dlgs$

        renderLang()
        renderChSub()
        renderItems()
        return
        function renderLang() {
            lang$.empty()
            constants.langs.map(a1 => {
                var r1 = $('<span />', {
                    class: "btn btn-outline-dark lang-item",
                    text: a1.cna,
                })
                r1.data('data', { na: a1.na, cna: a1.cna })
                return r1
            }).forEach(a1 => {
                a1.appendTo(lang$)
            })
        }
        function renderChSub() {
            chSub$.empty()
            constants.chSubs.map(a1 => {
                var r1 = $('<span>', {
                    class: "btn btn-outline-info ch-sub-item",
                    text: a1.cna,
                }).data('data', a1.na)
                return r1
            }).forEach(a1 => {
                a1.appendTo(chSub$)
                var r1 = a1.data('data')
                if (constants.chSubBr.includes(r1)) {
                    chSub$.append($('<br/>'))
                }
            })
        }

        function renderItems() {
            vers$.empty()

            constants.langs.map(a1 => {
                const re = $('<div />', {
                    class: 'group ' + a1.na
                })
                re.data('lang', a1.na)

                const vers = a1.vers as unknown as {
                    na: string,
                    cna: string,
                }[]

                Enumerable.from(vers)
                    .select(a2 => {
                        const r3 = $('<span/>', {
                            text: a2.cna,
                            class: 'book-item btn btn-outline-success',
                        }).data('data', a2)
                        return r3
                    }).forEach(a2 => {
                        re.append(a2)
                    })
                return re
            }).forEach(a1 => {
                vers$.append(a1)
            })
        }
    }
    private async makeSureDialogExistAsync() {
        const r1 = this.dlg$
        if (r1.length == 0) {
            this.generateBaseDiv$().appendTo($('body'))
            await sleepAsync(1);
            this.jqDialog()
        }
    }
    private generateBaseDiv$() {
        return $(getHtmlOfDialogVersions())
    }
    private async onDialogClose() {
        this.triggerCbClosed()
    }
    private async onDialogOpen() {
        await this.setWidthHeightAsync();
        await this.initSelectsAndOffensWhenOpen();
        await this.triggerCbOpened();
    }
    private jqDialog() {
        this.dlg$.dialog({
            autoOpen: false,
            modal: true,
            position: {
                my: 'center top',
                at: 'center top',
            },
            closeOnEscape: true,
            close: this.onDialogClose.bind(this),
            open: this.onDialogOpen.bind(this)
        })
    }
    // 用在 selected$ 與 offens$
    private getDataOfSpan(span: HTMLElement) {
        return $(span).data('data') as unknown as {
            na: string,
            cna: string,
            yr: number,
            od?: number,
        };
    }
    private getDataOfSpanOfSet(span: HTMLElement) {
        const r1 = $(span).data('data') as unknown as {
            na: string,
            cna: string,
            yr: number,
            od?: number,
        }[];
        return r1
    }
    private getSelectsAndOffensAndSets() {
        const { selecteds$, offens$, sets$ } = this.dlgs$
        /** @type {string[]} */
        const selects = Enumerable.from(selecteds$.children('span'))
            //.select(a1 => $(a1).data('data').na).toArray()
            .select(a1 => this.getDataOfSpan(a1).na).toArray()

        /** @type {string[]} */
        const offens = Enumerable.from(offens$.children('span'))
            .select(a1 => this.getDataOfSpan(a1).na).toArray()

        /** @type {string[][]} */
        const sets = Enumerable.from(sets$.children('span'))
            .select(a1 =>
                Enumerable.from(this.getDataOfSpanOfSet(a1))
                    .select(a2 => a2.na).toArray()
            ).toArray();

        // 目前 selects 這組，是否要新增到「新的一組」、或交換順序 (順序不同，視為不同組)     
        addSetsToRecent(sets, selects)

        return {
            selects,
            offens,
            sets,
        }

        // 目前 selects 這組，是否要新增到 新的一組(或交換順序)
        // 只有當 選擇 2個 譯本以上 才會生效
        function addSetsToRecent(ioSets: string[][], constSelects: string[]) {
            // sets 是選 1 個譯本以上，才有價值成為 set
            if (constSelects.length > 1) {
                var idx = findIndex()
                if (idx != -1) {
                    ioSets.splice(idx, 1) // 移掉那筆(要換到最前面)
                }
                ioSets.unshift(constSelects) // 目前這筆 插入到最前面
                if (ioSets.length > 10) {
                    ioSets.pop()
                }
            }

            return
            function findIndex() {
                // 此變數，非必要，只是提升效率用
                const r1 = Enumerable.from(constSelects).toLookup(a1 => a1);
                const cnt = constSelects.length // 連 length 都不對, 就可快速略過

                // 不同順序，視為相同
                for (let i = 0; i < ioSets.length; i++) {
                    const set = ioSets[i]
                    if (set.length != cnt) {
                        continue
                    }

                    // 當然，如果 selects 出現 [unv,unv] 這種不合理的，當然就會錯了
                    if (Enumerable.from(set).all(a2 => r1.contains(a2))) {
                        return i
                    }
                }
                return -1
            }
        }
    }
    private async setWidthHeightAsync() {
        await sleepAsync(1)
        const dlg$ = this.dlg$
        var cy = $(window).height()
        var cx = $(window).width()

        // dlg$.dialog("option", "maxHeight", cy * 0.95)
        dlg$.dialog("option", "height", cy * 0.95)
        // dlg$.dialog("option", "maxWidth", cx * 0.95)
        dlg$.dialog("option", "width", cx * 0.95)
    }
    private initSelectsAndOffensWhenOpen() {
        const joArgs = this.dlg$Data

        const { selecteds$, offens$, sets$, vers$, dlg$ } = this.dlgs$
        selecteds$.children('span').remove()
        offens$.children('span').remove()
        sets$.children('span').remove()
        var r3 = vers$.find('.book-item')
        r3.removeClass('active')

        getWhereNa(joArgs.selects).forEach(a1 => a1.trigger('click'))
        getWhereNa(joArgs.offens).reverse().forEach(a1 => {
            $(a1).trigger('click')
            $(a1).trigger('click') // trigger 兩次就會被移到 常用了        
        })
        joArgs.sets.forEach(addEachSet)

        return
        function addEachSet(set) {
            var r1 = getWhereNa(set)
            var r2 = Enumerable.from(r1).select(a1 => a1.data('data')).toArray()
            var cnas = getText()
            var tooltip = Enumerable.from(r2).select(a1 => a1.cna).toArray().join(',')

            $('<span>', {
                text: cnas,
                class: 'btn btn-outline-secondary btn-sm',
                'data-toggle': "tooltip",
                'data-placement': "top",
                'title': tooltip
            }).data('data', r2)
                .data('dom$', r1)
                .tooltip()
                .appendTo(sets$)
            return
            function getText() {
                /** @type {string[]} */
                var nas = Enumerable.from(r2).select(a1 => a1.cna).toArray()
                var two = Enumerable.from(nas).select(a1 => a1.substr(0, 2)).toArray().join(',')
                // (4) 和合,ES,KJ,CV
                return '(' + nas.length + ')' + two
            }
        }
        function getWhereNa(names) {
            if (getWhereNa.prototype.dicts == undefined) {
                getWhereNa.prototype.dicts = Enumerable.from(r3).toDictionary(a1 => $(a1).data('data').na, a1 => $(a1))
            }
            /** @type {Enumerable.IDictionary<any, JQuery<HTMLElement>>} */
            var dicts = getWhereNa.prototype.dicts

            addNewItemNotInCode()

            return Enumerable.from(names).select(a1 => dicts.get(a1)).where(a1 => a1 != undefined)
            function addNewItemNotInCode() {
                // 當新的版本有的時候，但是還沒有改程式碼
                // 在使用者呼叫完 uiabv.php 的時候，他會呼叫 setVersionsFromApi
                // 那時候就會把版本加到 選項中了，但是，若他選了那個版本(不論成為常用，或是被選，下次開啟時)
                // 就仍然不存在{被選、常選中}
                Enumerable.from(names).where(a1 => dicts.get(a1) == undefined)
                    .toArray()
                    .forEach(a1 => {
                        // insert item
                        var r1 = $('<span>', {
                            text: a1,
                            class: 'book-item btn btn-outline-success',
                        }).data('data', { na: a1, cna: a1 })
                            .appendTo(vers$.children('.ot'))
                        // insert to dict
                        dicts.add(a1, r1)
                    })
            }
        }
    }
}