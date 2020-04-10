import { Component, OnInit, Input, AfterViewInit, ViewChild, ChangeDetectorRef, ViewContainerRef, ComponentFactoryResolver, OnChanges, SimpleChanges } from '@angular/core';
import { asHTMLElement } from '../AsFunction/asHTMLElement';
import { ActivatedRoute } from '@angular/router';
import { VerseRange } from '../one-verse/show-data/VerseRange';
import { ApiQsb, QsbArgs, QsbResult, OneQsbRecord } from '../fhl-api/qsb';
import { BibleVersionQueryService } from '../fhl-api/bible-version-query.service';
import { tap, map } from 'rxjs/operators';
import { IBibleVersionQueryService } from '../fhl-api/IBibleVersionQueryService';
import { IApiQsb } from '../fhl-api/IApiQsb';
import { IOneChapInitialor } from '../one-chap/IOneChapInitialor';
import { ShowBase, ShowPureText } from '../one-verse/show-data/ShowBase';
import { VerseAddress } from '../one-verse/show-data/VerseAddress';
import { IOneVerseInitialor } from '../one-verse/test-data/IOneVerseInitialor';
import { OneVerseInitialor } from '../one-chap/OneVerseInitialor';
import { OneChapComponent } from '../one-chap/one-chap.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { isArrayEqualLength, isArrayEqual } from "../AsFunction/arrayEqual";

@Component({
  selector: 'app-version-parellel',
  templateUrl: './version-parellel.component.html',
  styleUrls: ['./version-parellel.component.css']
})
export class VersionParellelComponent implements OnInit, AfterViewInit, OnChanges {
  private isEnoughWidthParellel = true; //
  private widthLimitSet = 250;
  private bibleLink: string;
  // html in use
  private chaps: Array<IOneChapInitialor> = new Array<IOneChapInitialor>();
  private qstr: string;
  private isGb = false;
  private isSn = false;
  @Input() versions: Array<number> = [];
  @Input() width: number;
  @ViewChild('baseDiv', { read: ViewContainerRef, static: false }) baseDiv: ViewContainerRef;

  constructor(private route: ActivatedRoute,
    private cr: ComponentFactoryResolver,
    private detectChange: ChangeDetectorRef) {

    this.route.params.subscribe(async res => {
      // 因為 ; 在 angular 的 route 是特殊用途, 所以改 '.'
      this.bibleLink = res.description.replace(new RegExp('\\.', 'g'), ';');

      const qstr = VerseRange.fromReferenceDescription(this.bibleLink, 40).toStringEnglishShort();
      this.qstr = qstr;

      const results = await this.triggerContentsQueryAsync();
      this.chaps = results;
    });
  }

  private async triggerContentsQueryAsync() {
    return await new QueryContents().mainAsync(this.versions, this.qstr, this.isGb, this.isSn);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!isArrayEqual(changes.versions.previousValue, changes.versions.currentValue)) {
      // 取得聖經版本, 對應的內容, 設給 this.chaps
      this.triggerContentsQueryAsync().then(a1 => {
        this.chaps = a1;

        // 聖經版本數量有變的話，要改 layout (RWD) 的可能
        if (isArrayEqualLength(changes.versions.previousValue, changes.versions.currentValue)) {
          this.checkOneVersionPixelAndRerenderIfNeed();
        }
      });
    }
  }


  ngOnInit() {

  }

  calcEachVersionWidths(): number {
    if (this.width === undefined) {
      throw Error('need this.width.');
    }

    const cnt = this.versions.length !== 0 ? this.versions.length : 1;
    return this.width / cnt;
  }
  checkOneVersionPixelAndRerenderIfNeed() {
    const dom = asHTMLElement(this.baseDiv.element.nativeElement);
    const width = dom.offsetWidth;
    this.width = width;

    const isEnoughOld = this.isEnoughWidthParellel;
    this.isEnoughWidthParellel = this.calcEachVersionWidths() > this.widthLimitSet;
    if (isEnoughOld !== this.isEnoughWidthParellel) {
      this.detectChange.detectChanges();
    }
  }
  onResize(event) {
    this.checkOneVersionPixelAndRerenderIfNeed();
  }
  ngAfterViewInit(): void {
    this.checkOneVersionPixelAndRerenderIfNeed();

    const dom = asHTMLElement(this.baseDiv.element.nativeElement);
  }

  get layoutSet() {
    if (this.isEnoughWidthParellel) {
      return 'row';
    }
    return 'column';
  }
}

interface IQueryContents {
  mainAsync(iVers: number[], qstr: string, isGb: boolean, isSN: boolean);
}
class QueryContents implements IQueryContents {
  private verQ: IBibleVersionQueryService;
  private qsbQ: IApiQsb;
  private iVers: number[];
  private verEngs: string[]; // out
  constructor() {
    this.verQ = new BibleVersionQueryService();
    this.qsbQ = new ApiQsb();
  }
  async mainAsync(iVers: number[], qstr: string, isGb: boolean, isSN: boolean) {
    this.iVers = iVers;
    await this.queryVerEngs();

    // [0,2] -> [unv,bbc] -> [QsbResult,QsbResult] -> [ionechapinit,ionechapinit]
    const initors = this.iVers.map(async (iVer, i) => {
      const arg = new QsbArgs();
      arg.bibleVersion = this.verEngs[i];
      arg.qstr = qstr;
      arg.isExistStrong = isSN;
      arg.isSimpleChinese = isGb;
      return await (this.qsbQ.queryQsbAsync(arg).pipe(
        // tap(a2 => console.log(a2)),
        map(a2 => this.cvtQsbResultTo(a2, iVer, arg.bibleVersion)),
        // tap(a2 => console.log(a2.queryOneChap()[0].content())),
      ).toPromise());
    });

    return await Promise.all(initors);
  }
  private cvtQsbResultTo(qsb: QsbResult, iVer: number, verEng: string): IOneChapInitialor {
    // record 轉到 showBase[], 不同的版本, 會差很多, 所以多加一個 verEng
    return this.getIConvertViaVer(iVer, verEng).main(qsb);
  }
  private getIConvertViaVer(iVer: number, verEng: string): IQsbResultToOneChapInitialor {
    return new ParsingPureText(iVer, verEng);
  }


  private async queryVerEngs() {
    const r1 = await this.verQ.queryBibleVersionsAsync().toPromise();
    this.verEngs = this.iVers.map(a1 => r1[a1].na);
  }
}

interface IQsbResultToOneChapInitialor {
  main(qsb: QsbResult): IOneChapInitialor;
}
class ParsingPureText implements IQsbResultToOneChapInitialor {
  private iVer: number;
  private verEng: string;
  private book: number;
  constructor(iver, vereng) {
    this.iVer = iver;
    this.verEng = vereng;
  }
  main(qsb: QsbResult): IOneChapInitialor {
    return { queryOneChap: () => qsb.record.map(a1 => this.oneVerse(a1)) };
  }
  private oneVerse(obj: OneQsbRecord): IOneVerseInitialor {
    const r1 = new Array<ShowBase>();
    r1.push(new ShowPureText(obj.bible_text));
    const vr = new VerseAddress(this.book, obj.chap, obj.sec, this.iVer);
    return new OneVerseInitialor(r1, vr);
  }
}

