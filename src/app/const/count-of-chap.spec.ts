import { getChapCount, getChapCountEqual1BookIds } from './count-of-chap';

describe('count-of-chap', () => {
  it('01-basic', () => {
    expect(getChapCount(1)).toBe(50);
    expect(getChapCount(66)).toBe(22);
  });
  it('02-over', () => {
    expect(() => getChapCount(0)).toThrow(new Error('Error Book id, must 1~66'));
  });
});
describe('count-of-chap one chap id', () => {
  it('31 57 63 64 65', () => {
    expect(getChapCountEqual1BookIds()).toEqual([31, 57, 63, 64, 65]);
  });
});
