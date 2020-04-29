import { BookNameToId } from "./book-name-to-id"

describe('book-name-to-id', () => {
  it('01', () => {
    expect(new BookNameToId().cvtName2Id('太')).toBe(40);
    expect(new BookNameToId().cvtName2Id('1ki')).toBe(11);
    expect(new BookNameToId().cvtName2Id('second corinthians')).toBe(47);
  })
})
