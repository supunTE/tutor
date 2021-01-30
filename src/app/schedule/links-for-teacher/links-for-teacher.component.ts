import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ClassDocsInterface, ClassLinksInterface } from 'src/app/interfaces/class';
import { joined } from 'src/app/interfaces/joined';
import { AcconutService } from 'src/app/services/acconut.service';

@Component({
  selector: 'app-links-for-teacher',
  templateUrl: './links-for-teacher.component.html',
  styleUrls: ['./links-for-teacher.component.scss']
})

  export class LinksForTeacherComponent implements OnInit {
    // linkDataCollect: any;
    linksClass: Observable<ClassLinksInterface[]>;
    documentsClass: Observable<ClassDocsInterface[]>;
    // complete: number;
    link: string;
  
    @Input('linksData')
    set in(data){
      this.getData(data);
    }
    
    constructor(private accountService: AcconutService) { }
  
    ngAfterViewInit(){
     
    }
  
    getData(data){
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
  