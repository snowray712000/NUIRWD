
export const constants = {
    langs: [
        {
            na: 'ch', cna: '中文', od: 1, vers: [
                { na: 'cbol', cna: '原文直譯(參考用)', cds: ['yrnow', 'pr', 'officer'] },
                { na: 'tcv2019', cna: '現代中文譯本2019版', yr: 2019, cds: ['yrnow', 'pr', 'officer'] },
                { na: 'cccbst', cna: '聖經公會四福音書共同譯本', yr: 2015, cds: ['yrnow', 'pr', 'officer'] },
                { na: 'cnet', cna: 'NET聖經中譯本', yr: 2011, cds: ['yrnow', 'pr', 'study'] },
                { na: 'rcuv', cna: '和合本2010', yr: 2010, cds: ['yrnow', 'pr', 'officer'] },
                { na: 'csb', cna: '中文標準譯本', yr: 2008, cds: ['yrnow', 'pr', 'officer'] },
                { na: 'recover', cna: '恢復本', yr: 2003, cds: ['yrnow', 'pr', 'officer'] },
                { na: 'tcv95', cna: '現代中文譯本1995版', yr: 1995, cds: ['yrnow', 'pr', 'officer'] },
                { na: 'ncv', cna: '新譯本', yr: 1992, cds: ['yrnow', 'pr', 'officer'] },
                { na: 'lcc', cna: '呂振中譯本', yr: 1970, cds: ['yrnow', 'pr', 'officer', 'officer'] },
                { na: 'ofm', cna: '思高譯本', yr: 1968, cds: ['yrnow', 'cc', 'officer'] },
                { na: 'cwang', cna: '王元德官話譯本', yr: 1933, cds: ['pr', 'yr1960', 'officer'] },
                { na: 'cumv', cna: '官話和合本', yr: 1919, cds: ['pr', 'yr1960', 'officer'] },
                { na: 'unv', cna: '和合本', yr: 1911, cds: ['pr', 'yr1919', 'officer'] },
                { na: 'orthdox', cna: '俄羅斯正教文理譯本', yr: 1910, cds: ['ro', 'yr1919', 'ccht'], cna2: '東正教譯本新約與詩篇' },
                { na: 'cuwv', cna: '文理和合本', yr: 1907, cds: ['pr', 'yr1919', 'ccht'] },
                { na: 'wlunv', cna: '深文理和合本', yr: 1906, cds: ['pr', 'yr1960', 'ccht'] },
                { na: 'cuwve', cna: '淺文理和合本', yr: 1906, cds: ['pr', 'yr1919', 'ccht'] },
                { na: 'ssewb', cna: '施約瑟淺文理譯本', yr: 1902, cds: ['pr', 'yr1919', 'ccht'] },
                { na: 'pmb', cna: '北京官話譯本', yr: 1878, cds: ['pr', 'yr1919', 'officer'] },
                { na: 'deanwb', cna: '粦為仁譯本', yr: 1870, cds: ['pr', 'yr1919', 'ccht'] },
                { na: 'hudsonwb', cna: '胡德邁譯本', yr: 1867, cds: ['pr', 'yr1919', 'ccht'] },
                { na: 'wdv', cna: '文理委辦譯本', yr: 1854, cds: ['pr', 'yr1919', 'ccht'] },
                { na: 'goddwb', cna: '高德譯本', yr: 1853, cds: ['pr', 'yr1919', 'ccht'] },
                { na: 'nt1864', cna: '新遺詔聖經', yr: 1840, cds: ['pr', 'yr1850', 'ccht'] },
                { na: 'mormil', cna: '神天聖書', yr: 1823, cds: ['pr', 'yr1850', 'ccht'] },
                { na: 'marwb', cna: '馬殊曼譯本', yr: 1822, cds: ['pr', 'yr1850', 'ccht'] },
                { na: 'basset', cna: '白日昇徐約翰文理譯本', yr: 1707, cds: ['pr', 'yr1800', "ccht"] },
                { na: 'cmxuhsb', cna: '徐匯官話新譯福音', yr: 1948, cds: ['pr', 'yr1960', "officer"] },
                { na: 'cwangdmm', cna: '王多默聖史宗徒行實', yr: 1875, cds: ['pr', 'yr1919', "ccht"] },
                { na: 'cwhsiaosb', cna: '蕭舜華官話', yr: 1949, cds: ['pr', 'yr1960', "officer"] },
                { na: 'cwmgbm', cna: '四人小組譯本', yr: 1837, cds: ['pr', '1837', "ccht"] },
                { na: 'cwfaubsb', cna: '聖保祿書翰並數位宗徒涵牘', yr: 0, cds: ['cc'] },
                { na: 'cwjdsb', cna: '德如瑟四史聖經譯註', yr: 0, cds: ['cc'] },
                { na: 'cwkfag', cna: '郭實臘新遺詔書和舊遺詔聖書', yr: 1838, cds: ['pr', 'yr1850', "ccht"] },
                { na: 'cwliwysb', cna: '宗徒大事錄和新經譯義', yr: 1875, cds: ['pr', 'yr1919', "ccht"] },
                { na: 'cwmxb', cna: '馬相伯救世福音', yr: 1937, cds: ['pr', 'yr1919', "ccht"] },
                { na: 'cwont', cna: '俄羅斯正教新遺詔聖經', yr: 0, cds: ['ro'] },
                { na: 'cwplbsb', cna: '卜士傑新經公函與默示錄', yr: 0, cds: ['cc'] },
                { na: 'cwtaiping', cna: '太平天國文理譯本', yr: 1853, cds: ['pr', 'yr1919', "ccht"] },
                { na: 'cwwuchsb', cna: '吳經熊新經全集聖詠譯義', yr: 1946, cds: ['pr', 'yr1960', "ccht"] },
                { na: 'cxubinwsb', cna: '許彬文四史全編', yr: 1899, cds: ['pr', 'yr1919', "ccht"] },
                { na: 'cogorw', cna: '高連茨基聖詠經', yr: 0, cds: ['ro'] },
                { na: 'cogorw', cna: '高連茨基聖詠經', yr: 0, cds: ['ro'] },
            ]
        },
        {
            na: 'en', cna: '英文', od: 3, vers: [
                { na: 'kjv', yr: 1611, cna: 'KJV', od: 1 },
                { na: 'darby', yr: 1890, cna: 'Darby', od: 3 },
                { na: 'bbe', yr: 1965, cna: 'BBE', od: 5 },
                { na: 'erv', yr: 1987, cna: 'ERV', od: 7 },
                { na: 'asv', yr: 1901, cna: 'ASV', od: 9 },
                { na: 'web', yr: 2000, cna: 'WEB', od: 11 },
                { na: 'esv', yr: 2001, cna: 'ESV', od: 13 }
            ]
        },
        {
            na: 'hg', cna: '希伯來、希臘', od: 5, vers: [
                { na: 'bhs', cna: '舊約馬索拉原文', od: 1 },
                { na: 'fhlwh', cna: '新約原文', od: 3 },
                { na: 'lxx', cna: '七十士譯本', od: 5 },
            ]
        },
        {
            na: 'fo', cna: '其它外語', od: 7, vers: [
                { na: 'vietnamese', od: 1, cna: '越南聖經' },
                { na: 'russian', od: 3, cna: '俄文聖經' },
                { na: 'korean', od: 5, cna: '韓文聖經' },
                { na: 'jp', od: 7, cna: '日語聖經' },
                { na: 'baru', od: 9, cna: '印尼聖經' }, 
                { na: 'cvul', od: 11, cna: '武加大譯本' },
                { na: 'nvul', od: 13, cna: '新武加大譯本' },                
            ]
        },
        {
            na: 'mi', cna: '台語', od: 9, vers: [
                { na: 'ttvhl2021', od: 29, cna: '現代台語2021版漢字' },
                { na: 'ttvcl2021', od: 27, cna: '現代台語2021版全羅' },
                { na: 'ttvh', od: 3, cna: '聖經公會現代臺語漢字' },            
                { na: 'tte', od: 1, cna: '聖經公會現代臺語全羅' },
                { na: 'sgebklhl', od: 25, cna: '全民台語聖經漢羅' },
                { na: 'sgebklcl', od: 23, cna: '全民台語聖經全羅' },
                { na: 'apskhl', od: 11, cna: '紅皮聖經漢羅' },
                { na: 'apskcl', od: 9, cna: '紅皮聖經全羅' },
                { na: 'bklhl', od: 15, cna: '巴克禮漢羅' },
                { na: 'bklcl', od: 13, cna: '巴克禮全羅' },
                { na: 'tghg', od: 17, cna: '聖經公會巴克禮台漢本' },
                { na: 'prebklcl', od: 19, cna: '馬雅各全羅' },
                // {na:'prebklhl',od:20,cna:'馬雅各漢羅'}, // 要廢棄的，因為目前漢羅轉換差異，沒辦法順利轉換
            ]
        },
        {
            na: 'ha', cna: '客語', od: 10, vers: [
                { na: 'thv2e', od: 5, cna: '聖經公會現代客語全羅' },
                { na: 'thv12h', od: 7, cna: '聖經公會現代客語漢字' },
                { na: 'hakka', od: 21, cna: '汕頭客語聖經' }
            ]
        },
        {
            na: 'in', cna: '台灣原住民語', od: 11, vers: [
                { na: 'rukai', od: 1, cna: '聖經公會魯凱語聖經' },
                { na: 'wanshandia', od: 19, cna: '萬山魯凱語馬可福音' },
                { na: 'maolindia', od: 21, cna: '茂林魯凱語馬可福音' },
                { na: 'tonadia', od: 23, cna: '多納魯凱語馬可福音' },
                { na: 'tsou', od: 3, cna: '聖經公會鄒語聖經' },
                { na: 'ams', od: 5, cna: '聖經公會阿美語1997' },
                { na: 'amis2', od: 7, cna: '聖經公會阿美語2019' },
                { na: 'ttnt94', od: 9, cna: '聖經公會達悟語新約聖經' },
                { na: 'sed', od: 11, cna: '賽德克語' },
                { na: 'tru', od: 13, cna: '聖經公會太魯閣語聖經' },
                { na: 'bunun', od: 15, cna: '聖經公會布農語聖經' },
                { na: 'tay', od: 17, cna: '聖經公會泰雅爾語聖經' },
                { na: 'pinuyan', od: 25, cna: '卑南語' },
            ]
        },
        { na: 'ot', cna: '其它', od: 13, vers: [{ na: 'tibet', od: 1, cna: '藏語聖經' },] },
    ],
    chSubs: [
        { na: 'pr', cna: '基督新教' },
        { na: 'cc', cna: '羅馬天主教' },
        { na: 'ro', cna: '俄羅斯正教' },
        { na: 'officer', cna: '官話(白話文)' },
        { na: 'ccht', cna: '文理(文言文)' },
        { na: 'study', cna: '研讀本' },
        { na: 'yr1800', cna: '1800前' },
        { na: 'yr1850', cna: '1800-50' },
        { na: 'yr1919', cna: '1850-1918' },
        { na: 'yr1960', cna: '1919-60' },
        { na: 'yrnow', cna: '近代' },
    ],
    chSubBr: ['ro', 'study'],
}
