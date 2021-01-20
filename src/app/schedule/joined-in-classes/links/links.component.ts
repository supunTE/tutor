import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ClassInterface } from 'src/app/interfaces/class';
import { joined } from 'src/app/interfaces/joined';
import { AcconutService } from 'src/app/services/acconut.service';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent implements OnInit {
  linkDataCollect: any;
  joinedClass: ClassInterface;
  complete: number;
  link: string;

  @Input('linksData')
  set _linkDataCollect(data){
    this.getData(data, data.classData);
  }
  
  constructor(private accountService: AcconutService) { }

  ngAfterViewInit(){
   
  }

  getData(data, cd){
    this.joinedClass = cd;
    this.accountService.getSelectedJoinedClass(data.uid, data.cid).subscribe(dt => {
      this.complete = dt.complete;
    })
  }

  ngOnInit(): void {
  }

}
