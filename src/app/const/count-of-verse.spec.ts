import { getVerseCount } from './count-of-verse';
describe('count-of-verse', () => {
  it('01-basic', () => {
    expect(getVerseCount(1, 1)).toBe(31);
    expect(getVerseCount(1, 2)).toBe(25);
  });
  it('02-over', () => {
    expect(() => getVerseCount(1, 51)).toThrowError();
  });
});
