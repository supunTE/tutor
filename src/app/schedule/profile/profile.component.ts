import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import firebase from 'firebase/app';
import { Observable, Subscriber, of, Timestamp } from 'rxjs';
import { AcconutService } from '../../services/acconut.service';
import {message} from '../../interfaces/message'
import { ClassInterface } from '../../interfaces/class';
import { AngularFirestore } from '@angular/fire/firestore';
import { Teacher } from '../../interfaces/teacher';
import { LinebrPipe } from '../../pipes/linebr.pipe';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  private sub: any;
  idnum: any;
  selectedTeacher: Teacher;
  stars: number = 0;
  star1:boolean;
  star2:boolean;
  star3:boolean;
  star4:boolean;
  star5:boolean;
  arrStars = Array; 
  close: boolean = true;

  description:string = '';
  body:string = 'This is an \nexample. \n one\ntwo';

  constructor(private route: ActivatedRoute, public auth: AngularFireAuth, private accountService: AcconutService, private afs: AngularFirestore) { 
    auth.authState.subscribe(user => {
      if (user) {
    this.sub = this.route.params.subscribe(async params => {
      this.idnum = params.id;
      this.getSelectedUser(await this.idnum);
      this.starCollector(this.stars)
    })
    }
  })
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
    console.log(this.stars)
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
      this.description = this.selectedTeacher.description.toString()
      // console.log(this.description.includes('\\n'))
    })
  }

  ngOnInit(): void {
  }

}
