import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Teacher } from 'src/app/interfaces/teacher';
import { User } from 'src/app/interfaces/user';
import { AcconutService } from 'src/app/services/acconut.service';

@Component({
  selector: 'app-user-head',
  templateUrl: './user-head.component.html',
  styleUrls: ['./user-head.component.scss']
})
export class UserHeadComponent implements OnInit {

  @Input('rateuid') uid: string;
  userid:string = '';
  selectedUser: User;

  constructor(private accountService: AcconutService) {
    
  }

  ngAfterViewInit(){
    if(this.uid){
      this.getUser(this.uid);
    }
  }

  getUser(id){
    this.accountService.getUserWithId(id).subscribe(userData => {
      this.selectedUser = userData;
    })
  }

  ngOnInit(): void {
  }

}
