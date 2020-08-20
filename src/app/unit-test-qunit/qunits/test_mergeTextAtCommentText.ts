import { mergeTextAtCommentText } from 'src/app/side-nav-right/comment-tool/mergeTextAtCommentText';
import { UT } from './UT';
export async function test_mergeTextAtCommentText() {
  const gFnSafe = UT.gFnSafe;
  const equal = UT.equal;

  return gFnSafe(fns => {
    // test1
    const src = [
      { w: '●「僕人」', tpIdx: 5, space: 2 },
      { isBr: 1 },
      { w: '在希臘', space: 5 },
      { isBr: 1 },
      { w: '一樣', space: 5 },
    ];
    const dst = mergeTextAtCommentText(src, 0);
    const dstExcept = [
      { w: '●「僕人」在希臘一樣', tpIdx: 5, space: 2 },
    ];
    fns.push(equal('01', dstExcept, dst));

    // test2
  }, 'mergeTextAtCommentText exception');
}
