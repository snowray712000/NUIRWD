import { IOnChangedBibleVersionEngs, IUpdateBibleVersionEngs } from '../VerIdsManager-interfaces';
import { Observable, Subscriber } from 'rxjs';
import { isArrayEqual } from 'src/app/tools/arrayEqual';

interface DGlobalSettingBibleVersion {
  bibleVersions: string[];
}
export class BibleVersionsManager implements IUpdateBibleVersionEngs,
  IOnChangedBibleVersionEngs {

  settings: DGlobalSettingBibleVersion;
  private ob: Subscriber<string[]>;
  onChangedBibleVersionEngs$: Observable<string[]>;
  constructor() {
    this.settings = new DGlobalSettingBibleVersionLocalStorage();
    const pthis = this;
    this.onChangedBibleVersionEngs$ = new Observable<string[]>(ob => {
      pthis.ob = ob;
    });
    // toPromise() 才會馬上執行一次，這想 pthis.ob = ob 才會在下面執行前執行
    this.onChangedBibleVersionEngs$.toPromise();

    setTimeout(() => {
      if (pthis.settings.bibleVersions !== undefined) {
        pthis.ob.next(this.settings.bibleVersions);
      }
    }, 0);
  }
  updateBibleVersionEngs(vers: string[]) {
    const oldvers = this.settings.bibleVersions;
    this.settings.bibleVersions = vers;
    if (!isArrayEqual(oldvers, vers)) {
      this.ob.next(vers);
    }
  }
}

class DGlobalSettingBibleVersionLocalStorage implements DGlobalSettingBibleVersion {
  constructor() {
    const r1 = localStorage.getItem('bibleVersions');
    if (r1 !== undefined) {
      const r2 = JSON.parse(r1) as string[];
      this.engs = r2;
    }
    if (r1 === undefined || this.engs.length === 0) {
      this.engs = ['unv'];
    }
  }
  engs: string[] = [];
  get bibleVersions(): string[] { return this.engs; }
  set bibleVersions(val: string[]) {
    this.engs = val;
    localStorage.setItem('bibleVersions', JSON.stringify(val));
  }
}
