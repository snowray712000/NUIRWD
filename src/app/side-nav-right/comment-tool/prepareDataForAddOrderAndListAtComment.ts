import { DText } from "./../../bible-text-convertor/DText";
import Enumerable from 'linq';
import { assert } from 'src/app/tools/assert';
import { DListAdd } from 'src/app/rwd-frameset/dtexts-rendor/addListStartAndEnd';

interface DDataSpace { w?: string; space?: number; tpIdx?: number; isBr?: 1; };
/**
 * 開發 注釋 的 AddOrderAndList 時, 會用到 開發尋搜的功能,
 * 所以要將資料轉成 addListStartAndEnd() 能用的
 *
 * 沒有●, 沒層級, 當時是用 [] 作為 list
 * 第1層, 是用 [1], 不是 0based,
 */
export function prepareDataForAddOrderAndListAtComment(datas: DDataSpace[]): DListAdd[] {
  const isDebug = false;
  // 演算法，可看 unit test 了解
  const datasClone = [...datas]; // 不要破壞原本的內容, clone一份
  if (isDebug) {
    console.log('prepareDataForAddOrderAndListAtComment()');
    console.log([...datas]);
  }
  const reHeadAndTail = splitHeadAndBodyAndTail(datasClone);
  // console.log(reHeadAndTail);
  if (reHeadAndTail[0].length === 0 && reHeadAndTail[2].length === 0) {
    return core();
  } else {
    const r4b = prepareDataForAddOrderAndListAtComment(reHeadAndTail[1]);
    const r4a = Enumerable.from(reHeadAndTail[0]).select(a1 => cvtHeadOrBody(a1));
    const r4c = Enumerable.from(reHeadAndTail[2]).select(a1 => cvtHeadOrBody(a1));
    const r4 = r4a.concat(r4b).concat(r4c).toArray();
    return r4;
  }
  return [];
  function core() {
    // tslint:disable-next-line: no-string-literal
    Enumerable.from(datasClone).forEach((a1, i1) => a1['idx'] = i1);
    setBrSpace();
    const idxInit = Enumerable.range(0, datasClone.length).toArray();
    const idxListData = getFitMinSpaceAndRecursiveChildren(datasClone, idxInit);
    if (isDebug) {
      console.log(JSON.stringify(idxListData));
    }

    // console.log(idxListOther);
    const r4b = cvtToDListAdd(idxListData, datasClone);
    if (isDebug) {
      console.log(r4b);
    }
    return r4b;
    function setBrSpace() {
      Enumerable.from(datasClone).forEach((a1, i1) => {
        if (a1.isBr === 1) {
          a1.space = datasClone[i1 - 1].space;
        }
      });
    }
  }
}

// tslint:disable-next-line: max-line-length
function cvtToDListAdd(idxListData: { idx: any; list: number[]; }[], datasClone: DDataSpace[]) {
  return Enumerable.from(idxListData).concat().orderBy(a1 => a1.idx).select(a1 => {
    const data: DText = {};
    const ref = datasClone[a1.idx];
    if (ref.w !== undefined) {
      data.w = ref.w;
    }
    if (ref.isBr === 1) {
      data.isBr = 1;
    }
    const list = a1.list;

    return { data, list };
  }).toArray();
}

function doChildren(children: { idx: any; list: number[]; }[], datasClone: DDataSpace[]) {
  const re = [];
  const r3a = Enumerable.range(0, children.length - 1)
    .select(i1 => doChild(datasClone, children[i1], children[i1 + 1])).toArray();

  for (const it1 of r3a) {
    for (const it2 of it1) {
      re.push(it2);
    }
  }
  return re;
}

function doChild(datas: DDataSpace[], arg1: { idx: number, list: number[] }, arg2: { idx: number, list: number[] }) {
  // console.log('child');
  const idxs = Enumerable.range(arg1.idx + 1, arg2.idx - arg1.idx - 1).toArray();

  const r2 = getFitMinSpaceAndRecursiveChildren(datas, idxs);
  Enumerable.from(r2).forEach(a1 => a1.list.splice(0, 0, ...arg1.list));
  // console.log(JSON.stringify(r2));
  return r2;
}
/** */
function getFitMinSpaceAndRecursiveChildren(datas: DDataSpace[], idxThisRange: number[]) {
  const isDebug = false;
  if (isDebug) {
    console.log('getFitMinSpaceAndRecursiveChildren()');
    console.log([...datas]);
    console.log('idxs: ' + JSON.stringify(idxThisRange));
  }

  const minSpace = getSpaceMin(datas, idxThisRange);
  if (minSpace === undefined) {
    return [];
  }
  if (isDebug) {
    console.log('minSpace ' + minSpace);
  }

  const dataFitSpace = Enumerable.from(datas).skip(idxThisRange[0]).take(idxThisRange.length).where(a1 => {
    if (a1.isBr === 1 && a1.space !== undefined && (a1.space === minSpace || a1.space === minSpace + 1)) {
      return true;
    }
    if (a1.w === undefined || a1.w.length === 0) {
      return false;
    }
    if (a1.space === undefined) {
      return minSpace === 0;
    }
    return a1.space === minSpace || a1.space === minSpace + 1;
  }).toArray();
  if (isDebug) {
    console.log('找到idx ' + JSON.stringify(dataFitSpace.map(a1 => a1['idx'])));
    assert(() => dataFitSpace.length !== 0);
  }
  const listThisLevel = setListInThisLevel();
  const reChildren = doChildren2();
  const r4 = Enumerable.from(listThisLevel).concat(reChildren).orderBy(a1 => a1.idx).toArray();
  return r4;

  function doChildren2() {
    const listForChildren = tryAddVirtualNode([...listThisLevel]);

    const rePair = generatePair(listForChildren);
    if (isDebug) {
      console.log('data for children');
      console.log([...rePair]);
    }

    const rre = rePair.map(a1 => doChildren(a1 as any, datas));
    return merge(rre);
    function merge(lists: any[][]) {
      const rrMerge1 = [];
      for (const it1 of lists) {
        for (const it2 of it1) {
          rrMerge1.push(it2);
        }
      }
      return rrMerge1;
    }
    function generatePair(allNode: { idx?: number, list?: number[] }[]) {
      const rre: { idx?: number, list?: number[] }[][] = [];
      Enumerable.range(1, allNode.length - 1).forEach(i1 => {
        const pre = allNode[i1 - 1];
        const cur = allNode[i1];
        if (cur.idx === pre.idx + 1) { } else {
          rre.push([pre, cur]);
        }
      });
      return rre;
    }
    function tryAddVirtualNode(allNode: { idx?: number, list?: number[] }[]) {
      const idxFirstThisLevel = Enumerable.from(idxThisRange).firstOrDefault();
      const idxLastThisLevel = Enumerable.from(idxThisRange).lastOrDefault();
      if (allNode[0].idx !== idxFirstThisLevel) {
        allNode.splice(0, 0, { idx: idxFirstThisLevel - 1, list: [1] });
      }
      if (allNode[allNode.length - 1].idx !== idxLastThisLevel) {
        const lastItem = allNode[allNode.length - 1].list[0];
        allNode.push({ idx: idxLastThisLevel + 1, list: [lastItem + 1] });
      }
      return allNode;
    }
  }
  function setListInThisLevel() {
    let listStart = getListStart();
    const thisLevel = dataFitSpace.map(a1 => {
      const idx = a1['idx'] as number;
      if (isUseTheSameList(a1)) {
        return { idx, list: [listStart - 1] };
      } else {
        return { idx, list: [listStart++] };
      }
    });
    return thisLevel;
    function isUseTheSameList(a1: DDataSpace) {
      // {w:'純文字'} 而非 {w:'●項目',tpIdx:5} 時, 它的 list 與應要跟上一個一樣 ;
      // 因為每一個會 listStart++ , 所以上一個就是 listStart - 1
      return a1.tpIdx === undefined;
    }
    function getListStart() {
      const idxFitSpace = dataFitSpace.map(a1 => a1['idx'] as number);
      return idxFitSpace[0] === idxThisRange[0] ? 1 : 2;
      // return idxFitSpace[0] === 0 ? 1 : 2;
    }
  }
}

/** 若回傳 undefined, 表示中間已沒有東西了 */
function getSpaceMin(datas: DDataSpace[], idxThisRange: number[]) {
  // tslint:disable-next-line: max-line-length
  const r1 = Enumerable.from(datas).skip(idxThisRange[0]).take(idxThisRange.length).where(a1 => a1.w !== undefined && a1.w.length !== 0).select(a1 => a1.space !== undefined ? a1.space : 0).toArray();

  if (r1.length === 0) {
    return undefined;
  } else {
    return Enumerable.from(r1).min();
  }
}

function splitHeadAndBodyAndTail(datas: DDataSpace[]) {
  const r1 = Enumerable.from(datas).takeWhile(a1 => isHeadOrTail(a1)).toArray();
  const r2 = Enumerable.from(datas).reverse().takeWhile(a1 => isHeadOrTail(a1)).reverse().toArray();
  // const rBody = Enumerable.from(datas).skipWhile(a1 => isHeadOrTail(a1)).takeWhile(a1 => !isHeadOrTail(a1)).toArray();
  const rBody = Enumerable.from(datas).skipWhile(a1 => isHeadOrTail(a1))
    .reverse().skipWhile(a1 => isHeadOrTail(a1)).reverse().toArray();
  return [r1, rBody, r2];

  function isHeadOrTail(arg1: DDataSpace) {
    return (arg1.space === undefined || arg1.space === 0) && arg1.tpIdx === undefined;
  }
}

function cvtHeadOrBody(arg1: DDataSpace) {
  const data: DText = {};
  if (arg1.w !== undefined) {
    data.w = arg1.w;
  }
  if (arg1.isBr !== undefined) {
    data.isBr = arg1.isBr;
  }
  const re: DListAdd = {
    data, list: []
  };
  return re;
}
