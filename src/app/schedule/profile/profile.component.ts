import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import firebase from 'firebase/app';
import { Observable, Subscriber, of, Timestamp } from 'rxjs';
import { finalize, map, take } from 'rxjs/operators';
import { AcconutService } from '../../services/acconut.service';
import { message } from '../../interfaces/message'
import { ClassInterface } from '../../interfaces/class';
import { AngularFirestore } from '@angular/fire/firestore';
import { Teacher } from '../../interfaces/teacher';
import { LinebrPipe } from '../../pipes/linebr.pipe';
import { rateTeacher } from '../../interfaces/rate'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  private sub: any;
  idnum: any;
  selectedTeacher: Teacher;
  ratesMessages: Observable<rateTeacher[]>;
  stars: number = 0;
  star1:boolean;
  star2:boolean;
  star3:boolean;
  star4:boolean;
  star5:boolean;
  arrStars = Array; 
  close: boolean = true;
  chatInput: string;
  notEnoughLetters:boolean = false;
  successSubmit:boolean = false;
  rateuid: string = '';

  description:string = '';
  body:string = 'This is an \nexample. \n one\ntwo';

  constructor(private route: ActivatedRoute, public auth: AngularFireAuth, private accountService: AcconutService, private afs: AngularFirestore) { 
    auth.authState.subscribe(user => {
      if (user) {
    this.sub = this.route.params.subscribe(params => {
      this.idnum = params.id;
      this.getSelectedUser(this.idnum);
      this.starCollector(this.stars)
      this.ratesMessages = this.accountService.getTeachersRate(this.idnum)
    })
    }
  })
  }

  submitRate(uid,tid){
    if(this.chatInput.length > 20){
    

      this.accountService.getTeacher(tid).pipe(take(1), map((teacherData: Teacher) => {
        const {rateTotal, ratersTotal} = teacherData;
        return ({rateTotal, ratersTotal});
      })).subscribe(({rateTotal, ratersTotal}) => {

        this.accountService.getRateSelectedTeacher(uid, tid).pipe(take(1),
         map((rateData: rateTeacher) => {
           if(rateData){
            const {rateCount} = rateData;
            return ({rateCount});
           }else{
             return ({rateCount:0});
           }
          
        })).subscribe(({rateCount}) => {
          var rateCountData, ratersCountData;

          if(rateCount != 0){
            rateCountData = (rateTotal - rateCount) + this.stars
            ratersCountData = ratersTotal;
          }else{            
            if(!ratersTotal){
              ratersCountData = 1;
              rateCountData = this.stars
            }else{
              ratersCountData = ratersTotal + 1;
              rateCountData = rateTotal + this.stars
            }
          }

          // console.log(rateTotal, rateCount, this.stars, rateCountData,rateCountData)

          this.accountService.updateTotalRateSelectedTeacher(tid, rateCountData, ratersCountData)

          const newRate: rateTeacher = {
            uid: uid,
            tid: tid,
            rateMessage: this.chatInput,
            rateCount: this.stars,
            time: new Date()
          }
      
          this.accountService.rateSelectedTeacher(uid, tid, newRate);
          this.notEnoughLetters = false;
          this.successSubmit = true;   

        });    
        
      });         

    }else{
      this.notEnoughLetters = true;
      this.successSubmit = false;
    }
    
  }

  closeMe(){
    // console.log(this.count);
    // this.count = false;
  }

  starFunction(n){
    if(this.stars == n){
        this.stars = n-1
    }else{
      this.stars = n
    }
    this.starCollector(this.stars)
    // console.log(this.stars)
  }

  starCollector(n){
    if(n==0){
      this.star1 = false
      this.star2 = false
      this.star3 = false
      this.star4 = false
      this.star5 = false
    }else if(n==1){
      this.star1 = true
      this.star2 = false
      this.star3 = false
      this.star4 = false
      this.star5 = false
    }else if(n==2){
      this.star1 = true
      this.star2 = true
      this.star3 = false
      this.star4 = false
      this.star5 = false
    }else if(n==3){
      this.star1 = true
      this.star2 = true
      this.star3 = true
      this.star4 = false
      this.star5 = false
    }else if(n==4){
      this.star1 = true
      this.star2 = true
      this.star3 = true
      this.star4 = true
      this.star5 = false
    }else if(n==5){
      this.star1 = true
      this.star2 = true
      this.star3 = true
      this.star4 = true
      this.star5 = true
    }
  }

  async getSelectedUser(id){
    this.accountService.getTeacher(id).subscribe(sTeacher => {

      this.selectedTeacher = sTeacher
      if(this.selectedTeacher.description){
        this.description = this.selectedTeacher.description.toString()
      }
      // console.log(this.description.includes('\\n'))
    })
  }

  ngOnInit(): void {
  }

}
