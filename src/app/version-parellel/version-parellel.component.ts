import { VerCache } from "../fhl-api/BibleVersion/VerCache";
import { VerGetDisplayName } from "../fhl-api/BibleVersion/VerGetDisplayName";
import Enumerable from 'linq';
// tslint:disable-next-line: max-line-length
import { Component, OnInit, HostListener, Input, AfterViewInit, ViewChild, ChangeDetectorRef, ViewContainerRef, ComponentFactoryResolver, OnChanges, SimpleChanges, Output, EventEmitter, AfterViewChecked, ViewChildren, AfterContentInit, AfterContentChecked, QueryList, ElementRef, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { asHTMLElement } from '../tools/asHTMLElement';
import { isArrayEqualLength, isArrayEqual } from '../tools/arrayEqual';
import { RouteStartedWhenFrame } from '../rwd-frameset/RouteStartedWhenFrame';
import { OneBibleVersion, cvtToOneBibleVersion } from '../fhl-api/BibleVersion/OneBibleVersion';
import { IOnChangedSettingIsSn } from './version-parellel-interfaces';
import { IsSnManager } from '../rwd-frameset/settings/IsSnManager';
import { IsMapPhotoManager } from '../rwd-frameset/settings/IsMapPhotoManager';
import { DAddress } from '../bible-address/DAddress';
import { DOneLine } from "../bible-text-convertor/DOneLine";
import { DText } from "../bible-text-convertor/DText";

import { DOneLineHeight } from './one-ver/one-ver.component';
import { HeightCalc } from './HeightCalc';
import { EventSideNavs, IEventSideNavs } from '../rwd-frameset/EventSideNavs';
import { DataForInterlaceQueryor } from "../version-interlace/version-interlace.component";
import { VerseRange, VerseRangeComparor } from "../bible-address/VerseRange";
import { debounceTime, forkJoin, interval, lastValueFrom, Observable, scan, Subject, timer } from "rxjs";
import { VerForMain } from "../rwd-frameset/settings/VerForMain";
import { ApiQsb, DOneQsbRecord, DQsbResult } from "../fhl-api/ApiQsb";
import { DisplayLangSetting } from "../rwd-frameset/dialog-display-setting/DisplayLangSetting";
import { cvt_others } from "../bible-text-convertor/cvt_others";
import { DQsbResult2DOneLineConvertor } from "../version-interlace/DQsbResult2DOneLineConvertor";
import { SnActiveEvent } from "../rwd-frameset/settings/SnActiveEvent";
import { FontSize } from "../rwd-frameset/settings/FontSize";

import { FunctionIsOpened } from "../side-nav-right/FunctionIsOpened";
import { DialogSearchResultOpenor } from "../rwd-frameset/search-result-dialog/DialogSearchResultOpenor";
import { MatDialog } from "@angular/material/dialog";
import { DSeApiRecord } from "../rwd-frameset/search-result-dialog/searchAllIndexViaSeApiAsync";
import { BookNameLang } from "../const/book-name/BookNameLang";
import { BibleBookNames } from "../const/book-name/BibleBookNames";
import { EventVerseChanged } from "../side-nav-right/cbol-parsing/EventVerseChanged";
import { DomManagers, scrollToSelected } from "../rwd-frameset/DomManagers";
import { assert } from "../tools/assert";
import { DisplayFormatSetting } from "../rwd-frameset/dialog-display-setting/DisplayFormatSetting";

// import { EventVersionsChanged } from '../side-nav-left/ver-select/EventVersionControlBridge';
// import { BibleVersionsManager } from '../rwd-frameset/settings/BibleVersionsManager';


@Component({
  selector: 'app-version-parellel',
  templateUrl: './version-parellel.component.html',
  styleUrls: ['./version-parellel.component.css'],
})
export class VersionParellelComponent implements OnInit, AfterViewInit, OnChanges, AfterViewChecked {
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isDataChanged = true
    this.removeHeightStyleForDataChanged()
  }

  triggerWindowResizeEvent() {
    const event = new Event('resize');
    window.dispatchEvent(event);
  }

  private isEnoughWidthParellel = true; //
  private isSn = false;
  private isMapPhoto = false;
  @Input() width: number;
  @ViewChildren('cell1') cellsRefs: QueryList<ElementRef>;
  @ViewChild('title1') title1: ElementRef;
  @ViewChild('data1') data1: ElementRef;
  @Output() clickVerse = new EventEmitter<{ address: DAddress, ver: string }>();

  addresses: VerseRange
  versions: string[]
  cntCol = 3
  cntRow = 0
  data: DText[][][] = []
  gArray(a1: number) { return new Array(a1) }

  widthEach: number;
  private isViewInit = false
  private isDataChanged = true

  constructor(private cr: ComponentFactoryResolver,
    private cd: ChangeDetectorRef,
    private renderer: Renderer2,
    public dialog: MatDialog,) {
  }
  // data cntRow
  resetDataAndCntRow() {
    const r1: DText[][] = [[{ w: '' }]]
    const r2: DText[][] = Enumerable.range(0, this.cntCol).select(a1 => [{ w: '【取得資料中...】' }]).toArray()
    this.data = [r1.concat(r2)]
    this.cntRow = 1
  }
  ngOnInit() {
    interface DRecord { bible_text: string; chap: number; chineses: string; engs: string; sec: number; }

    // this.isDataChanged = true
    this.versions = VerForMain.s.getValue()
    this.cntCol = this.versions.length + 1
    this.resetDataAndCntRow()
    setTimeout(() => {
      this.isDataChanged = true
      this.triggerWindowResizeEvent()
    }, 0);

    getRouteChangedObserable().subscribe(async verseRange => {
      if (isTheSame(this.addresses, verseRange)) return
      if (verseRange.verses.length === 0) return

      this.addresses = verseRange
      this.reQueryDataAsync().then(a1 => {
        setTimeout(() => {
          // 使用者似乎更喜歡，切過來就自動同步
          // 不喜歡 "還沒點擊，就保持原本的 selected 網址"
          EventVerseChanged.s.updateValueAndSaveToStorageAndTriggerEvent(this.addresses.verses[0])

          this.isDataChanged = true
          this.triggerWindowResizeEvent()

          scrollToTop()
        }, 0);
      })
      return
      function isTheSame(addr1: VerseRange, addr2: VerseRange): boolean {
        return VerseRange.isTheSame(addr1, addr2);
      }
      function scrollToTop(){
        const r1 = DomManagers.s.getDivContent()
        if ( r1 != null) r1.scrollTop = 0;
      }
    });

    VerForMain.s.changed$.subscribe(data => {
      const newVersions = VerForMain.s.getValue()
      if (isTheSameVersion(this.versions, newVersions)) return

      this.versions = newVersions
      this.cntCol = this.versions.length + 1
      this.resetDataAndCntRow()
      this.reQueryDataAsync().then(a1 => {
        setTimeout(() => {
          this.isDataChanged = true
          this.triggerWindowResizeEvent()
        }, 0);
      })
      return
      function isTheSameVersion(ver1: string[], ver2: string[]): boolean {
        if (ver1.length != ver2.length) return false
        return Enumerable.range(0, ver1.length).all(i => ver1[i] == ver2[i])
      }
    })

    IsSnManager.s.changed$.subscribe(a1 => {
      setTimeout(() => {
        this.isDataChanged = true
        this.triggerWindowResizeEvent()
      }, 0);
    })
    DisplayFormatSetting.s.changed$.subscribe(a1 => {
      this.reQueryDataAsync().then(a1 => {
        setTimeout(() => {
          this.isDataChanged = true
          this.triggerWindowResizeEvent()
        }, 0);
      })
    })
    FontSize.s.changed$.subscribe(a1 => {
      setTimeout(() => {
        this.isDataChanged = true
        this.triggerWindowResizeEvent()
      }, 0);
    })

    FunctionIsOpened.s.changed$.subscribe(a1 => {
      this.setTitleWidthEqualParentWidth()
      setTimeout(() => {
        this.isDataChanged = true
        this.triggerWindowResizeEvent()
      }, 0);
    })

    return

    function getRouteChangedObserable(): Observable<VerseRange> {
      const routeFrame = new RouteStartedWhenFrame();
      return routeFrame.routeTools.verseRange$;
    }
  }
  setTitleWidthEqualParentWidth() {
    // 不再用 title.width: 100% 因為不會正確. 可能是 fixed 造成的
    if (this.title1 == undefined) return

    let parentWidth = this.title1.nativeElement.parentElement.clientWidth;

    setTimeout(() => {
      parentWidth = this.data1.nativeElement.clientWidth
      this.title1.nativeElement.style.width = `${parentWidth}px`;
    }, 30);
  }
  ngAfterViewInit(): void {
    this.isViewInit = true
    this.setTitleWidthEqualParentWidth()
  }
  ngAfterViewChecked(): void {
    // 發出一個事件到可觀察物件
    if (this.isViewInit) {
      if (this.isDataChanged) {
        this.updateHeightAndSetIsDataChangedFalse();
      }
    }
  }
  htmlFlexCalcWidthByCotCol() {
    return `calc((100% - 2em)/${this.cntCol - 1})`
  }
  htmlGetVersionName(na: string) {
    return new VerGetDisplayName().main(na)
  }
  htmlOnClickAddressCell(row: number, col: number) {
    const that = this
    const dtext = this.getDTextOFRowCol(row, col)
    if (dtext == null ) return 

    if (isOneChap()) {
      this.triggerActiveVerseChangedIfNotNull(dtext)
    } else {
      const dtext2 = gDtextOfTheSameBookChap(dtext)
      that.showDialogOfReference(dtext2)
    }
    return

    function isOneChap() {
      const verses = that.addresses.verses
      if (verses.length == 0) return true
      const v0 = verses[0]
      return Enumerable.from(verses).all(a1 => a1.book == v0.book && a1.chap == v0.chap)
    }
    function gDtextOfTheSameBookChap(dtext: DText) {
      const r1 = dtext.refAddresses!
      const r2 = DisplayLangSetting.s.getBookNameOfLangSet(r1[0].book)
      let re: DText  = {w: r2, isRef:1, refDescription: `${r2}:${r1[0].chap}`}
      return re
    }
  }
  htmlOnClickTextCell(row: number, col: number) {
    const dtext = this.getDTextOFRowCol(row, col)
    this.triggerActiveVerseChangedIfNotNull(dtext)
  }
  htmlBindEvent_SnClickDialog(dtext: DText) {
    new DialogSearchResultOpenor(this.dialog)
      .showDialog({ keyword: `${dtext.tp}${dtext.sn}`, isDict: 1, addresses: this.addresses.verses });
  }
  htmlBindEvent_ReferenceClickDialog(dtext: DText) {
   this.showDialogOfReference(dtext)
  }
  // dtext.refDescription = "創1" 之類的
  showDialogOfReference(dtext: DText){
    const keyword = `#${dtext.refDescription}|`
    new DialogSearchResultOpenor(this.dialog).showDialog({ keyword: keyword, addresses: this.addresses.verses });
  }
  removeHeightStyleForDataChanged() {
    if (this.isViewInit) {
      for (let a1 of this.cellsRefs) {
        this.renderer.removeStyle(a1.nativeElement, "height")
      }
    }
    this.isDataChanged = true
  }
  getDTextOFRowCol(row: number, col: number): DText {
    const dtexts = this.data[row][0]
    return Enumerable.from(dtexts).firstOrDefault(null)
  }
  triggerActiveVerseChangedIfNotNull(dtext?: DText) {
    if (dtext != null && dtext.refAddresses != null && dtext.refAddresses.length > 0) {
      const addr = dtext.refAddresses[0]
      EventVerseChanged.s.updateValueAndSaveToStorageAndTriggerEvent(addr);
    }
  }
  updateHeightAndSetIsDataChangedFalse(): void {
    this.removeHeightStyleForDataChanged()
    let r1 = Enumerable.from(this.cellsRefs.toArray()).groupBy(a1 => a1.nativeElement.getAttribute("data-row"))
    for (const a1 of r1) {
      let maxHeight = Enumerable.from(a1).max(aa1 => aa1.nativeElement.offsetHeight)

      for (let aa1 of a1) {
        this.renderer.setStyle(aa1.nativeElement, "height", `${maxHeight}px`)
      }
    }

    this.isDataChanged = false;
  }

  getIsShowSn() {
    return this.isSn;
  }
  getIsBreakLineEachVerse() {
    return true;
  }
  getIsShowMapPhoto() {
    return this.isMapPhoto;
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  async reQueryDataAsync() {
    const that = this

    // 取得資料
    const dataEachVer = await queryAsync()

    // 特例，此譯本沒有此段經文
    if (Enumerable.from(dataEachVer).any(a1 => a1.record.length == 0)) {
      addNoDataInformation(dataEachVer)
    }

    // 轉換為 DOneLine，若有 5 節，則會有 5 個  DOneLine，若有2個譯本，則會有 [2][5] 個 DOneLine
    const data2EachVer = Enumerable.from(that.versions)
      .zip(dataEachVer, (a1, a2) => ({ ver: a1, data: a2 }))
      .select(a1 => ({
        ver: a1.ver,
        data: new DQsbResult2DOneLineConvertor().main(a1.ver, a1.data, that.addresses)
      }
      ))
      .toArray()

    // 多譯本合併為 GridData
    const resultMerge = megerData()

    // 設定狀態
    that.data = resultMerge.data
    that.cntRow = resultMerge.cntRow

    return

    function megerData() {
      const cntCol = data2EachVer.length + 1 // + 1 是 address

      // 所有譯本的，所有節
      const addressAllVersion = mergeAddressesOfAllVersionThenOrderThenDstinct();

      // 下面要用，
      const dictAddress2Row = Enumerable.range(0, addressAllVersion.length).toDictionary(i => VerseRangeComparor.s.hashNumer(addressAllVersion[i]), i => i)
      const cntRow = addressAllVersion.length
      let dataGrid: DText[][][] = generateEmptyData()
      for (let c = 0; c < cntCol; ++c) {
        if (c == 0) {
          assignAddressColumn();
          continue
        }

        const r1 = data2EachVer[c - 1]
        for (const data of r1.data) {
          const r2 = VerseRangeComparor.s.hashNumer(data.addresses)
          if (dictAddress2Row.contains(r2) == false) {
            assert(() => dictAddress2Row.contains(r2), "前面沒處理好，字典中一定會有才對")
          }
          const row = dictAddress2Row.get(r2)
          dataGrid[row][c] = data.children
        }
      }

      return { data: dataGrid, cntRow }
      function generateEmptyData(): DText[][][] {
        let re: DText[][][] = []
        for (let r = 0; r < cntRow; ++r) {
          re.push(Enumerable.range(0, cntCol).select(a1 => [] as DText[]).toArray());
        }
        return re
      }
      function assignAddressColumn() {

        for (let r = 0; r < cntRow; ++r) {
          const r1 = addressAllVersion[r];
          const r2 = (r1 == undefined || r1.verses.length == 0) ? '' : getName(r1)
          let re: DText[] = [{ w: r2, refAddresses: r1.verses }]; // 不要加 isRef , // 加上 r1.verses 讓 click 時可用
          dataGrid[r][0] = re;
        }
        return;
        function getName(v: VerseRange) {
          return DisplayFormatSetting.s.getDisplayOfVerseRange(v, isOverOneBookOrOneChap())
        }
        function isOverOneBookOrOneChap() {
          const r1 = Enumerable.from(addressAllVersion).select(a1 => a1.verses).aggregate([] as DAddress[], (prev, a1) => prev.concat(a1))

          const isOverOneBook = Enumerable.from(r1).select(a1 => a1.book).distinct().count() > 1
          if (isOverOneBook) return true

          const isOverOneChap = Enumerable.from(r1).select(a1 => a1.chap).distinct().count() > 1
          if (isOverOneChap) return true;

          return false
        }
      }
      function mergeAddressesOfAllVersionThenOrderThenDstinct() {
        let addrs: VerseRange[] = [];
        for (const a1 of data2EachVer) {
          for (const a2 of a1.data) {
            if (a2.addresses)
              addrs.push(a2.addresses!);
          }
        }

        return Enumerable.from(addrs).orderBy(a1 => a1, VerseRangeComparor.s.compare).distinct(VerseRangeComparor.s.hashNumer).toArray();
      }
    }

    function addNoDataInformation(dataEachVer: DQsbResult[]) {
      const tpLang = DisplayLangSetting.s.getValueIsGB() ? BookNameLang.太GB : BookNameLang.太
      const chinese = BibleBookNames.getBookName(that.addresses.verses[0].book, tpLang)
      const chap = that.addresses.verses[0].chap
      const verse = that.addresses.verses[0].verse

      for (let i = 0; i < that.versions.length; i++) {
        if (dataEachVer[i].record.length == 0) {
          const ver = that.versions[i]
          const ver2 = new VerGetDisplayName().main(ver)

          dataEachVer[i].record.push({ bible_text: `【此譯本沒有此段經文】`, chineses: chinese, chap: chap, sec: verse } as DOneQsbRecord)
        }
      }
    }
    async function queryAsync() {
      let isGb = DisplayLangSetting.s.getValueIsGB()
      // let qstr = isGb ? routeTool.verseRangeLast.toStringChineseGBShort() : routeTool.verseRangeLast.toStringChineseShort()
      let qstr = isGb ? that.addresses.toStringChineseGBShort() : that.addresses.toStringChineseShort()

      let reApis = that.versions.map(ver => {
        let r1 = new ApiQsb()
        return lastValueFrom(r1.queryQsbAsync({
          bibleVersion: ver,
          qstr, isExistStrong: true,
          isSimpleChinese: isGb
        }))
      })
      return await Promise.all(reApis)
    }
  }
  calcEachVersionWidths(): number {
    if (this.width === undefined) {
      throw Error('need this.width.');
    }

    const cnt = this.versions.length !== 0 ? this.versions.length : 1;
    return this.width / cnt;
  }
  onClickVerse(address: DAddress, verEng: string) {
    this.clickVerse.emit({ address, ver: verEng });
  }
  get layoutSet() {
    if (this.isEnoughWidthParellel) {
      return 'row';
    }
    return 'column';
  }
  // 在 ngOnInit 呼叫
  private testUserCase1_2Async() {
    let r1 = new TestData2()
    r1.step1()
    this.cntRow = 1
    this.cntCol = 1
    this.data = r1.data

    setTimeout(() => {
      this.removeHeightStyleForDataChanged()
      this.isDataChanged = true
    }, 0);

    setTimeout(() => {
      let rr = new TestData2()
      rr.step2()
      this.cntRow = 3
      this.cntCol = 3
      this.data = rr.data
      this.cd.detectChanges()
      this.cd.markForCheck()
      setTimeout(() => {
        this.isDataChanged = true
        this.removeHeightStyleForDataChanged()
      }, 0);
    }, 1000);

    setTimeout(() => {
      let rr = new TestData2()
      rr.step3()
      this.cntRow = 3
      this.cntCol = 3
      this.data = rr.data

      setTimeout(() => {
        this.isDataChanged = true
        this.removeHeightStyleForDataChanged()
      }, 0);
    }, 3000);
  }
}

class TestData2 {
  data: DText[][][]
  cntRow: number
  cntCol: number
  step1() {
    let row0: DText[][] = [[{ w: '' }], [{ w: '取得資料中' }], [{ w: '取得資料中' }]]

    this.data = [row0]
    this.cntRow = 1
    this.cntCol = 3
  }
  step2() {
    let row0: DText[][] = [[{ w: '羅1:1' }], [{ w: '耶穌' }, { w: '基督的僕人保羅，奉召為使徒，特派傳　神的福音。' }], [{ w: '取得資料中' }]]
    let row1: DText[][] = [[{ w: '羅1:2' }], [{ w: '這福音是　神從前藉眾先知在聖經上所應許的，' }], [{ w: '' }]]
    let row2: DText[][] = [[{ w: '羅1:3' }], [{ w: '論到他兒子─我主耶穌基督。按肉體說，是從大衛後裔生的；' }], [{ w: '' }]]

    this.data = [row0, row1, row2]
    this.cntRow = 3
    this.cntCol = 3
  }
  step3() {
    let row0: DText[][] = [[{ w: '羅1:1' }],
    [
      { w: '我' }, { w: '【1】', foot: { id: 1, version: 'csb', book: 45, chap: 1, verse: 1 } },
      // <span class="ft" ft="1" ver="csb" chap="1" engs="Rom">【1】</span>
      { w: '耶穌' }, { w: '<2424>', sn: '2424', tp: 'G' },
      { w: '【1】', foot: { version: 'cnet', book: 45, chap: 1, verse: 1, id: 1 } },
      { w: '基督的' }, { w: '<5547>', sn: '5547', tp: 'G' },
      { isHr: 1 },
      { w: '僕人保羅，奉召為使徒，特派傳　神的福音。' },
      //  <span class="ft" ft="1" ver="cnet" chap="1" engs="Rom">【1】</span>
      // { w: '【180】', foot: { book:1, chap: 4, version: 'cnet', id: 180 } } NET聖經中譯本
      { isBr: 1 },

    ],
    [{ w: '我是基督耶穌的僕人保羅；上帝選召我作使徒，特派我傳他的福音。' }]]
    // let row0: DText[][] = [[{ w: '羅1:1' }], [{ w: '耶穌' }, { w: '耶穌' }, { w: '基督的僕人保羅，奉召為使徒，特派傳　神的福音。' }], [{ w: '我是基督耶穌的僕人保羅；上帝選召我作使徒，特派我傳他的福音。' }]]
    let row1: DText[][] = [[{ w: '羅1:2' }], [{ w: '這福音是　神從前藉眾先知在聖經上所應許的，' }], [{ w: '這福音是上帝在很久以前藉著他的眾先知在聖經上所應許的，內容有關他的兒子—我們的主耶穌基督。從身世來說，他是大衛的後代；從聖潔的神性說，因上帝使他從死裡復活，以大能顯示他是上帝的兒子。' }]]
    let row2: DText[][] = [[{ w: '羅1:3' }], [{ w: '論到他兒子─我主耶穌基督。按肉體說，是從大衛後裔生的；' }], [{ w: '【併入上節】' }]]

    this.data = [row0, row1, row2]
    this.cntRow = 3
    this.cntCol = 3
  }
}
