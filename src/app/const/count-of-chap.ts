// tslint:disable-next-line: max-line-length
const cnum: Array<number> = [50, 40, 27, 36, 34, 24, 21, 4, 31, 24, 22, 25, 29, 36, 10, 13, 10, 42, 150, 31, 12, 8, 66, 52, 5, 48, 12, 14, 3, 9, 1, 4, 7, 3, 3, 3, 2, 14, 4, 28, 16, 24, 21, 28, 16, 16, 13, 6, 6, 4, 4, 5, 3, 6, 4, 3, 1, 13, 5, 5, 3, 5, 1, 1, 1, 22];
export function getChapCount(book1based: number): number {
  if (book1based >= 1 && book1based <= 66) {
    return cnum[book1based - 1];
  }
  throw new Error('Error Book id, must 1~66' + 'you pass ' + book1based);
}
let bookIdsOnlyOneChap: Array<number>;
export function getChapCountEqual1BookIds() {
  if (bookIdsOnlyOneChap === undefined) {
    bookIdsOnlyOneChap = cnum.map((a1, i) => {
      return {
        id: i + 1,
        cnt: a1
      };
    }).filter(a1 => a1.cnt === 1).map(a1 => a1.id);
  }
  return bookIdsOnlyOneChap;
}
