import { Component, OnInit } from '@angular/core';
import { VerseActivedChangedDo } from '../cbol-parsing/VerseActivedChangedDo';
import { IsLocalHostDevelopment } from 'src/app/fhl-api/IsLocalHostDevelopment';
import { DAddress } from 'src/app/bible-address/DAddress';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-sn-branch',
  templateUrl: './sn-branch.component.html',
  styleUrls: ['./sn-branch.component.css']
})
export class SnBranchComponent implements OnInit {
  urlPdf1: string ; // = 'https://bible.fhl.net/tree/45/45_016.pdf'
  urlPdf2: string ; // = 'https://bible.fhl.net/tree/45/45_016e.pdf'      
  selectedOption: string = "1"
  constructor() {    
  }
  onSelectChanged(event:MatRadioChange ){    
    this.selectedOption = event.value
  }
  ngOnInit(): void {    
    var that = this

    // 此變數，是避免同一章，一直重刷 pdf。
    let curAddr: DAddress = null

    function generateUrlSnTree(chap){
      // 目前只購買了羅馬書，45，其它都沒有
      let chapstr = chap.toString().padStart(3, '0'); // 016
      
      var r1 = IsLocalHostDevelopment.isLocalHost ? 'https://bible.fhl.net' : ''

      return [`${r1}/tree/45/45_${chapstr}.pdf`,
      `${r1}/tree/45/45_${chapstr}e.pdf`]
    }
    
    VerseActivedChangedDo('樹狀圖', addr => {
      if ( addr.book == 45 ){
        if ( curAddr == null || curAddr.chap != addr.chap) {
          let r1 = generateUrlSnTree(addr.chap)
          that.urlPdf1 = r1[0]
          that.urlPdf2 = r1[1]
          curAddr = addr
        }
      } else {
        this.urlPdf1 = null
        this.urlPdf2 = null
        curAddr = null
      }      
    });    
  }

}
