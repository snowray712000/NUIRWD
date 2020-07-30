export class SearchSetting {
  loadSearchBibleVersion() {
    const r1 = localStorage.getItem('SearchBibleVersion');
    return r1 === null ? 'unv' : r1; // 若不存在, 不是回傳 undefined , 是 null
  }
  saveSearchBibleVersion(ver: string) {
    localStorage.setItem('SearchBibleVersion', ver);
  }
  loadSearchBibleSnVersion() {
    const r1 = localStorage.getItem('SearchSnBibleVersion');
    return r1 === null ? 'unv' : r1; // 若不存在, 不是回傳 undefined , 是 null
  }
  saveSearchSnBibleVersion(ver: string) {
    localStorage.setItem('SearchSnBibleVersion', ver);
  }
  loadIsEnableColorKeyword(): 0 | 1 {
    const r1 = localStorage.getItem('IsEnableColorKeyword');
    return r1 === null ? 1 : parseInt(r1, 10) as 0 | 1;
  }
  saveIsEnableColorKeyword(a1: 0 | 1) {
    localStorage.setItem('IsEnableColorKeyword', `${a1}`);
  }
}
