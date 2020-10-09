import { prepareDataForAddOrderAndListAtComment } from 'src/app/side-nav-right/comment-tool/prepareDataForAddOrderAndListAtComment';
import { UT } from './UT';
/** 注釋開發 */
export async function test_prepareDataForAddOrderAndListAtComment() {
  const equal = UT.equal;
  return UT.gFnSafe(fns => {
    // 情境可按順序看
    // 演算法,先看 test4(), 然後回頭看 test1() test2() test3() test5()
    // 試跑後,才出現 case6 之後
    test1();
    test2();
    test3();
    test4();
    test5();
    test6();
    return;
    function test1() {
      // 演算:
      // 找到最小, space是2
      // space=2, 可得 [0],[3] 都符合, 列為同一層.
      // 記下 {idx:0,list:[1]}, {idx:3,list:[2]}
      //
      // 找[0]-[3] 之間的[1],[2], 最小為space 5,
      // space=5, 可得 [1],[2] 都符合, 列為同一層,
      // 記下 {idx:1,list:[1,1]} {idx:2,list:[1,2]}
      //
      // [1]-[2] 中間無元素, 結束.
      const src: { w?: string; space?: number; tpIdx?: number; isBr?: 1; }[] = [
        { w: '● 1-1', tpIdx: 5, space: 2 },
        { w: '● 2-a', tpIdx: 5, space: 5 },
        { w: '● 2-b', tpIdx: 5, space: 5 },
        { w: '● 1-2', tpIdx: 5, space: 2 },
      ];
      const dst = prepareDataForAddOrderAndListAtComment(src);
      const dstExcept = [
        { data: { w: '● 1-1' }, list: [1] },
        { data: { w: '● 2-a' }, list: [1, 1] },
        { data: { w: '● 2-b' }, list: [1, 2] },
        { data: { w: '● 1-2' }, list: [2] },
      ];
      // 說明文件用
      const dstExcept2 = [
        { data: { w: '引言（#1:1-17）' }, list: [] },
        { data: { w: '一、問安（#1:1-7）' }, list: [1] },
        { data: { w: '（一）表明自己身份（#1:1）' }, list: [1, 1] },
        { data: { w: '1.保羅：' }, list: [1, 1, 1] },
        { data: { w: '(1)耶穌基督的僕人。' }, list: [1, 1, 1, 1] },
        { data: { w: '(2)奉召為使徒。' }, list: [1, 1, 1, 2] },
        { data: { w: '(3)特派傳神的福音。' }, list: [1, 1, 1, 3] },
        { data: { w: '●「保羅」字義是...' }, list: [1, 1, 1, 4] },
        { data: { w: '●「僕人」.....' }, list: [1, 1, 1, 5] },
        {}, // 中間略
        { data: { w: '（二）對所奉召傳的....' }, list: [1, 2] },
      ];
      fns.push(equal('01.沒有換行', dstExcept, dst));
      // fns.push({st:1,msg:})
    }

    function test2() {
      // 演算
      // 從 a1.w 存在中找最小 space, 得到 2 (若有w,但沒有space,視同為0)
      // space=2, [0],[5] 都符合,
      // 記下 {idx:0,list:[1]} {idx:5,list:[2]}
      //
      // 找[0]-[5]之間
      // 最小 space = 5,
      // space=5, [2],[4] 都符合,
      // 記下 {idx:2,list:[1,1]}, {idx:4,list:[1,2]}
      //
      // 找[2]-[4]之間, 無有效, 結束
      //
      // 填還沒有 list 的, [1] [3]
      // 填最靠近的, 所以 {idx:1,list:[1]}, {idx:3,list[1,1]}
      // 結束

      const src: { w?: string; space?: number; tpIdx?: number; isBr?: 1; }[] = [
        { w: '● 1-1', tpIdx: 5, space: 2 },
        { isBr: 1 },
        { w: '● 2-a', tpIdx: 5, space: 5 },
        { isBr: 1 },
        { w: '● 2-b', tpIdx: 5, space: 5 },
        { w: '● 1-2', tpIdx: 5, space: 2 },
      ];
      const dst = prepareDataForAddOrderAndListAtComment(src);
      const dstExcept = [
        { data: { w: '● 1-1' }, list: [1] },
        { data: { isBr: 1 }, list: [1] },
        { data: { w: '● 2-a' }, list: [1, 1] },
        { data: { isBr: 1 }, list: [1, 1] },
        { data: { w: '● 2-b' }, list: [1, 2] },
        { data: { w: '● 1-2' }, list: [2] },
      ];
      fns.push(equal('02.有換行', dstExcept, dst));
    }

    function test3() {
      // 演算
      // 從有w中找最小space, 得到 0
      // space=0, 符合的有 [0] [3]
      // 記為 {idx:0,list:[1]} {idx:3,list:[2]}
      //
      // 在[0]-[3]中間找
      // 從有w中找最小space, 得到 2
      // space=2, 符合的有 [1] [2]
      // 記為 {idx:1,list:[1,1]} {idx:2,list:[1,2]}
      //
      // 在[1]-[2]中間找, 無, 結束
      const src: { w?: string; space?: number; tpIdx?: number; isBr?: 1; }[] = [
        { w: '保羅書信' },
        { w: '● 1-1', tpIdx: 5, space: 2 },
        { w: '● 1-2', tpIdx: 5, space: 2 },
        { w: '說明一切', space: 0 },
      ];
      const dst = prepareDataForAddOrderAndListAtComment(src);
      const dstExcept = [
        { data: { w: '保羅書信' }, list: [] },
        { data: { w: '● 1-1' }, list: [1] },
        { data: { w: '● 1-2' }, list: [2] },
        { data: { w: '說明一切' }, list: [] },
      ];
      fns.push(equal('03.有零層的', dstExcept, dst));
    }
    function test4() {
      // 3->5->4 不合理, 要嘛就是3,要嘛就是大於5
      // 3->5->5(假設4判定是5)->2 不合理, 要麻就是3,要嘛就是大於等於5,因為第1層是3
      // 綜合以上, 1. 要先取得最小, 2. 要取得區間最小
      // 取得最小2,令它為第1層...它以前的,若有任何大於2, 那就有一個一定要等於2
      // 承上, 因為idx 0,1,2 space都是大於2, 那麼取第1個為2, 也就是3為2。
      //
      // 上面方法缺點: 若一頁面,它第一行本來就真的是較凸排(可能是繼上頁),就無法顯出來了
      //
      // Step1: 找到最小 2 [3]
      // Step2: 找到 [0] 是 2, 允許+1個空白
      // Step3: [0]->[3] 區間, 找到最小 [2] 是 4
      // Step4: 找到 [1] 也屬於 4, 允許+1個空白
      // Step5: [1]->[2] 再無區間, 結束
      // Step:
      // Step6: [0],[3] list設為[1]與[2], [0]->[3] 中間的第1個是[1]
      // Step7: [1],[2] list設為[1]與[2], 堆在上面就變成 [1,1], [1,2]
      const src: { w?: string; space?: number; tpIdx?: number; isBr?: 1; }[] = [
        { w: '● 1-1', tpIdx: 5, space: 3 },
        { w: '● 2-a', tpIdx: 5, space: 5 },
        { w: '● 2-b', tpIdx: 5, space: 4 },
        { w: '● 1-2', tpIdx: 5, space: 2 },
      ];
      const dst = prepareDataForAddOrderAndListAtComment(src);
      const dstExcept = [
        { data: { w: '● 1-1' }, list: [1] },
        { data: { w: '● 2-a' }, list: [1, 1] },
        { data: { w: '● 2-b' }, list: [1, 2] },
        { data: { w: '● 1-2' }, list: [2] },
      ];
      fns.push(equal('04.空白歪一點', dstExcept, dst));
      // fns.push({st:1,msg:})
    }
    function test5() {
      // 演算:
      // 有w中, 找最小space, 得 1
      // space=1, 符合idx有 0,3,6,7
      // 記為 {idx:0,list:[1]}{idx:3,list:[2]}{idx:6,list:[3]}{idx:7,list:[4]}
      //
      /// [0]-[3] 中間找, 最小是 space=4
      /// space=4, 符合idx有 1,2
      /// 記為 {idx:1,list:[1,1]}{idx:2,list:[1,2]}
      ///
      //// [1]-[2] 中間找, 無, 結束
      ///
      /// [3]-[6] 中間找, 最小是 space=7
      /// space=7, 符合idx有 4,5
      /// 記為 {idx:4,list:[2,1]}{idx:5,list:[2,2]}
      ///
      //// [4]-[5] 中間找, 無, 結束
      ///
      /// [6]-[7] 中間找, 無, 結束
      const src: { w?: string; space?: number; tpIdx?: number; isBr?: 1; }[] = [
        { w: '● 1-1', tpIdx: 5, space: 2 },
        { w: '● 2-a', tpIdx: 5, space: 4 },
        { w: '● 2-b', tpIdx: 5, space: 5 },
        { w: '● 1-2', tpIdx: 5, space: 2 },
        { w: '● 2-c', tpIdx: 5, space: 7 },
        { w: '● 2-d', tpIdx: 5, space: 8 },
        { w: '● 1-3', tpIdx: 5, space: 2 },
        { w: '● 1-4', tpIdx: 5, space: 1 },
      ];
      const dst = prepareDataForAddOrderAndListAtComment(src);
      const dstExcept = [
        { data: { w: '● 1-1' }, list: [1] },
        { data: { w: '● 2-a' }, list: [1, 1] },
        { data: { w: '● 2-b' }, list: [1, 2] },
        { data: { w: '● 1-2' }, list: [2] },
        { data: { w: '● 2-c' }, list: [2, 1] },
        { data: { w: '● 2-d' }, list: [2, 2] },
        { data: { w: '● 1-3' }, list: [3] },
        { data: { w: '● 1-4' }, list: [4] },
      ];
      fns.push(equal('05.綜合.縮排不同;2組以上', dstExcept, dst));
      // fns.push({st:1,msg:})
    }
    function test6() {
      test6a();
      test6b();
      test6c();
      test6d();
      test6e();
      return;

      function test6a() {
        // 原算法: 會錯誤,如下
        // 找出最小 space, 得 2
        // 符合space:2, 有 [0]
        // 記下 {idx:0,list:[1]}
        //
        /// 不用找 children, 因為沒有2個以上, 結束.

        // 新算法:
        // 找出最小 space, 得 2
        // 符合 space:2, 有[0]
        // 記下 {idx:0,list:[1]}
        //
        // (找出0, 應該要有 0-1 之間找)
        const src: { w?: string; space?: number; tpIdx?: number; isBr?: 1; }[] = [
          { w: '●1', tpIdx: 5, space: 2 },
          { w: '●2', tpIdx: 5, space: 5 },
        ];

        const dst = prepareDataForAddOrderAndListAtComment(src);
        const dstExcept = [
          { data: { w: '●1' }, list: [1] },
          { data: { w: '●2' }, list: [1, 1] },
        ];
        fns.push(equal('06a.虛擬的', dstExcept, dst));
      }
      function test6b() {
        // space = 2, 符合的是 [1]
        // 還要加 虛擬的 -1, 於是變成 {idx:-1,list:[1]},{idx:1,list:[2]}
        //
        /// 找[-1]-[1] 之間的
        /// space = 5, 符合的是 [0]
        /// {idx:0,list:[1]} ... 累加後 {idx:0,list:[1,1]}
        /// <=2, 所以結束
        const src: { w?: string; space?: number; tpIdx?: number; isBr?: 1; }[] = [
          { w: '●1', tpIdx: 5, space: 5 },
          { w: '●2', tpIdx: 5, space: 2 },
        ];
        const dst = prepareDataForAddOrderAndListAtComment(src);
        const dstExcept = [
          { data: { w: '●1' }, list: [1, 1] },
          { data: { w: '●2' }, list: [2] },
        ];
        fns.push(equal('06b.順序相反', dstExcept, dst));
      }
      function test6c() {
        // 6d: 就是後面還有文字, 文字有space0的與space2的
        const src: { w?: string; space?: number; tpIdx?: number; isBr?: 1; }[] = [
          { w: 'a', space: 0 },
          { isBr: 1, space: 0 },
          { w: 'b', space: 0 },
          { w: '●1', tpIdx: 5, space: 5 },
          { w: '●2', tpIdx: 5, space: 2 },
        ];
        const dst = prepareDataForAddOrderAndListAtComment(src);
        const dstExcept = [
          { data: { w: 'a' }, list: [] },
          { data: { isBr: 1 }, list: [] },
          { data: { w: 'b' }, list: [] },
          { data: { w: '●1' }, list: [1, 1] },
          { data: { w: '●2' }, list: [2] },
        ];
        fns.push(equal('06c.前有0層', dstExcept, dst));
      }
      function test6d() {
        // 6e: 有的 item 是 space:0, 但它不是 [], 而是 [1]
        //
        //
        const src: { w?: string; space?: number; tpIdx?: number; isBr?: 1; }[] = [
          { w: 'a', space: 0 },
          { w: '●1', tpIdx: 5, space: 5 },
          { w: '●2', tpIdx: 5, space: 2 },
          { isBr: 1, },
          { w: 'b', space: 2 },
          // { w: 'c', space: 0 },
        ];
        const dst = prepareDataForAddOrderAndListAtComment(src);
        const dstExcept = [
          { data: { w: 'a' }, list: [] },
          { data: { w: '●1' }, list: [1, 1] },
          { data: { w: '●2' }, list: [2] },
          { data: { isBr: 1 }, list: [2] },
          { data: { w: 'b' }, list: [2] },
          // { data: { w: 'c' }, list: [] },
        ];
        fns.push(equal('06d.後面有空白', dstExcept, dst));
      }
      function test6e() {
        const src: { w?: string; space?: number; tpIdx?: number; isBr?: 1; }[] = [
          { w: 'a', space: 0 },
          { w: '壹、', space: 0, tpIdx: 1 },
          { w: 'b', space: 0 },
          { w: '●1', tpIdx: 5, space: 5 },
          { w: '●2', tpIdx: 5, space: 2 },
        ];
        const dst = prepareDataForAddOrderAndListAtComment(src);
        const dstExcept = [
          { data: { w: 'a' }, list: [] },
          { data: { w: '壹、' }, list: [1] },
          { data: { w: 'b' }, list: [1] },
          { data: { w: '●1' }, list: [1, 1, 1] },
          { data: { w: '●2' }, list: [1, 2] },
        ];
        fns.push(equal('06e.項目space:0', dstExcept, dst));
      }
    }

  }, 'prepareDataForAddOrderAndListAtComment exception');
}
