describe('Regex Practice', () => {
  it('01-regex practice', () => {
    const r1 = new RegExp('馬太福音');
    expect(r1.test('馬太 1:2-3')).toBe(false);

    const r2 = '嘿馬太福音1:2-3'.match(r1);
    expect(r2[0]).toBe('馬太福音');
    expect(r2.index).toBe(1);
  });

  it('02-regex 括號 or', () => {
    const r1 = new RegExp('((馬太|路加|約翰|馬可)福音)');
    const r2 = '嘿馬太福音1:2-3'.match(r1);
    expect(r2[0]).toBe('馬太福音');
    expect(r2[1]).toBe('馬太福音');
    expect(r2[2]).toBe('馬太');
    expect(r2.index).toBe(1);
  });

  it('03-regex 取代', () => {
    const r1 = new RegExp('(馬太福音|馬可福音)');
    const r2 = '嘿馬太福音1:2-3'.replace(r1, 'Mt');
    expect(r2).toBe('嘿Mt1:2-3');

    // 結論，regex match 有3層 [0] [1] [2] 就是那個值，下一個就是 index，再下個是input
    const r3 = '嘿馬太福音1:2-3'.replace(r1, (a1, a2, a3, a4) => {
      expect(a1).toBe('馬太福音');
      expect(a2).toBe('馬太福音');
      expect(a3).toBe(1);
      expect(a4).toBe('嘿馬太福音1:2-3');
      if (a1 === '馬太福音') { return 'Mt'; }
      return 'Mk';
    });
    expect(r3).toBe('嘿Mt1:2-3');
  });

  it('04-regex ignore case', () => {
    const r1 = new RegExp('matt', 'i');
    const r2 = 'Matt1:2-3'.match(r1);
    expect(r2[0]).toBe('Matt');
  });
});
