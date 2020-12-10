import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Observable, Subscriber } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { FormControl, FormGroup } from '@angular/forms';
import { AcconutService } from '../services/acconut.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  stateStudent = false;
  stateTeacher = false;
  // userData: Observable<User>;
  userState: string = '';
  showSchedule = false;

  // className: string = '';
  // subject: string = '';
  // category: string = '';
  // batchYear: string = '';
  // numberOfWeeks: string = '';
  // classesPerWeek: string = '';
  // monday = false;
  // tuesday = false;
  // wednesday = false;
  // thursday = false;
  // friday = false;
  // saturday = false;
  // sunday = false;
  // mondayTime: string = '';
  // tuesdayTime: string = '';
  // wednesdayTime: string = '';
  // thursdayTime: string = '';
  // fridayTime: string = '';
  // saturdayTime: string = '';
  // sundayTime: string = '';

  // scheduleForm = new FormGroup({
  //   className: new FormControl(''),
  //   subject: new FormControl(''),
  //   category: new FormControl(''),
  //   batchYear: new FormControl(''),
  //   numberOfWeeks: new FormControl(''),
  //   _classesPerWeek: new FormControl(''),
  //   get classesPerWeek() {
  //     return this._classesPerWeek;
  //   },
  //   set classesPerWeek(value) {
  //     this._classesPerWeek = value;
  //   },
  //   mondayData: new FormControl(''),
  //   tuesdayData: new FormControl(''),
  //   wednesdayData: new FormControl(''),
  //   thursdayData: new FormControl(''),
  //   fridayData: new FormControl(''),
  //   saturdayData: new FormControl(''),
  //   sundayData: new FormControl(''),
  //   mondayTime: new FormControl(''),
  //   tuesdayTime: new FormControl(''),
  //   wednesdayTime: new FormControl(''),
  //   thursdayTime: new FormControl(''),
  //   fridayTime: new FormControl(''),
  //   saturdayTime: new FormControl(''),
  //   sundayTime: new FormControl(''),
  //   otherDetails: new FormControl('')
  // });
  

  constructor(public auth: AngularFireAuth, private afs: AngularFirestore, private accountService: AcconutService) {
    auth.authState.subscribe(user => {
      if (user) {
        this.checkCategory(firebase.auth().currentUser);
      }
    });
   }

  checkCategory(userID){
    const text = this.accountService.getUser(userID).pipe(map(({ category }) => category));
    const subscribe = text.subscribe(state => {
      this.takeState(state);
    });
  }

  takeState(state){
    console.log(state);

    if(state === 'Student'){
      this.stateStudent = true;
      this.stateTeacher = false;
    }

    if(state === 'Teacher'){
      this.stateTeacher = true;
      this.stateStudent = false;
    }
  }

  ngOnInit(): void { }

}
