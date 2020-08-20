import { addListStartAndEnd, DListAdd } from 'src/app/rwd-frameset/search-result-dialog/dtexts-rendor/addListStartAndEnd';
import { UT } from './UT';
/** 開發搜尋dialog時, 原文字典時會用的  */
export async function test_addListStartAndEndUnitTests() {
  return UT.gFnSafe(re => {
    {
      const src: DListAdd[] = [
        { data: { w: '● 1-1' }, list: [1] },
        { data: { w: '○ 2-a' }, list: [1, 1] },
        { data: { w: '○ 2-b' }, list: [1, 2] },
        { data: { w: '● 1-2' }, list: [2] },
      ];
      const dst = addListStartAndEnd(src);
      const dst2: DListAdd[] = [
        { data: { isOrderStart: 1 } },

        { data: { isListStart: 1 } },
        { data: { w: '● 1-1' }, list: [1] },
        { data: { isOrderStart: 1 } },
        { data: { isListStart: 1 } },
        { data: { w: '○ 2-a' }, list: [1, 1] },
        { data: { isListEnd: 1 } },
        { data: { isListStart: 1 } },
        { data: { w: '○ 2-b' }, list: [1, 2] },
        { data: { isListEnd: 1 } },
        { data: { isOrderEnd: 1 } },
        { data: { isListEnd: 1 } },

        { data: { isListStart: 1 } },
        { data: { w: '● 1-2' }, list: [2] },
        { data: { isListEnd: 1 } },
        { data: { isOrderEnd: 1 } },
      ];
      re.push(UT.equal('01-兩層。第二層是被包含在前一層的li。', dst2, dst));
    }
    {
      const src: DListAdd[] = [
        { data: { w: '● 1-1' }, list: [1] },
        { data: { isBr: 1 } },
        { data: { w: '● 1-2' }, list: [2] },
      ];
      const dst = addListStartAndEnd(src);
      const dst2: DListAdd[] = [
        { data: { isOrderStart: 1 } },
        { data: { isListStart: 1 } },
        { data: { w: '● 1-1' }, list: [1] },
        { data: { isListEnd: 1 } },
        { data: { isOrderEnd: 1 } },
        { data: { isBr: 1 } },

        { data: { isOrderStart: 1 } },
        { data: { isListStart: 1 } },
        { data: { w: '● 1-2' }, list: [2] },
        { data: { isListEnd: 1 } },
        { data: { isOrderEnd: 1 } },
      ];
      re.push(UT.equal('02-換行存在。會中斷 list。', dst2, dst));
    }
    {
      const src: DListAdd[] = [
        { data: { w: '● 1-1' }, list: [1] },
        { data: { isBr: 1 }, list: [1] },
        { data: { w: '● 1-2' }, list: [2] },
      ];
      const dst = addListStartAndEnd(src);

      const dst2: DListAdd[] = [
        { data: { isOrderStart: 1 } },
        { data: { isListStart: 1 } },
        { data: { w: '● 1-1' }, list: [1] },
        { data: { isBr: 1 }, list: [1] },
        { data: { isListEnd: 1 } },
        { data: { isListStart: 1 } },
        { data: { w: '● 1-2' }, list: [2] },
        { data: { isListEnd: 1 } },
        { data: { isOrderEnd: 1 } },
      ];
      re.push(UT.equal('02b-換行存在。不中斷法(注意input)。', dst2, dst, '換行想在 1-1 的 li 中，那麼換行就必需 list[1], 與 1-1的list[1] 一樣。'));
    }
  });
}
