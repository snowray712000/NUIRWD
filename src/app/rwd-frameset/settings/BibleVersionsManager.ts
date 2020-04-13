import { IOnChangedBibleVersionEngs, IUpdateBibleVersionEngs } from '../VerIdsManager-interfaces';
import { DGlobalSetting } from './DGlobalSetting';
import { Observable, interval, Subscriber } from 'rxjs';
import { isArrayEqual } from 'src/app/AsFunction/arrayEqual';

interface DGlobalSettingBibleVersion {
  bibleVersions: string[];
}
export class BibleVersionsManager implements IUpdateBibleVersionEngs,
  IOnChangedBibleVersionEngs {

  settings: DGlobalSettingBibleVersion;
  private ob: Subscriber<string[]>;
  onChangedBibleVersionEngs$: Observable<string[]>;
  constructor() {
    this.settings = new TestDGlobalSettingBibleVersion();
    const pthis = this;
    this.onChangedBibleVersionEngs$ = new Observable<string[]>(ob => {
      pthis.ob = ob;
    });

    // 若在建構子時, this.ob 雖然上面已經 new 了, 但是 ob 還會是 null, 因此用 timeout 後來再執行 ;
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

class TestDGlobalSettingBibleVersion implements DGlobalSettingBibleVersion {
  constructor() {
    const r1 = localStorage.getItem('bibleVersions');
    if (r1 !== undefined) {
      const r2 = JSON.parse(r1);
      this.engs = r2;
    }
  }
  engs: string[] = [];
  get bibleVersions(): string[] { return this.engs; }
  set bibleVersions(val: string[]) {
    this.engs = val;
    localStorage.setItem('bibleVersions', JSON.stringify(val));
  }
}
