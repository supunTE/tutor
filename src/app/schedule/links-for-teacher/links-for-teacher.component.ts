import { Component, OnInit, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    minRangeDate; maxRangeDate;
    todayDate: Date;

  
    @Input('linksData')
    set in(data){
      this.getData(data);
    }
    
    addLinkForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      link: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(256)]),
      time: new FormControl('', Validators.required),
      otherData: new FormControl(''),
    })

    constructor(private accountService: AcconutService, public auth: AngularFireAuth) { }
  
    ngAfterViewInit(){
     
    }

    copyMessage(link){
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = link;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
    }

    pickStartDate(){
      this.todayDate = new Date();  
      // this.todayDate.setMonth(this.todayDate.getMonth() - 3)
      return this.todayDate;
    }
  
    pickEndDate(){
      this.todayDate = new Date();  
      this.todayDate.setMonth(this.todayDate.getMonth() + 3)
      return this.todayDate;
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
      this.minRangeDate = this.pickStartDate();
      this.maxRangeDate = this.pickEndDate();
    }
  
  }
  