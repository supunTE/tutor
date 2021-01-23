import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ClassDocsInterface, ClassLinksInterface } from 'src/app/interfaces/class';
import { joined } from 'src/app/interfaces/joined';
import { AcconutService } from 'src/app/services/acconut.service';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent implements OnInit {
  // linkDataCollect: any;
  linksClass: Observable<ClassLinksInterface[]>;
  documentsClass: Observable<ClassDocsInterface[]>;
  complete: number;
  link: string;

  @Input('linksData')
  set in(data){
    this.getData(data);
  }
  
  constructor(private accountService: AcconutService) { }

  ngAfterViewInit(){
   
  }

  getData(data){
    this.accountService.getSelectedJoinedClass(data.uid, data.cid).subscribe(dt => {
      this.complete = dt.complete;
    })
    // this.accountService.getSelectedInJoinedClass(data.cid).subscribe(dt => {
    //   this.joinedClass = dt;
    //   console.log(dt)
    // })
    this.linksClass = this.accountService.getLinksInJoinedClass(data.cid)
    this.documentsClass = this.accountService.getDocsInJoinedClass(data.cid)
  }

  ngOnInit(): void {
  }

}
