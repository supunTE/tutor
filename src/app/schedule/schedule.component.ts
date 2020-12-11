import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Observable, Subscriber } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { ClassInterface } from '../interfaces/class';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AcconutService } from '../services/acconut.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  stateStudent = false;
  stateTeacher = false;
  classData: ClassInterface;
  userState: string = '';
  showSchedule = false;
  scheduleComplete = false;
  userData: User;

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

  scheduleForm = new FormGroup({
    className: new FormControl(''),
    subject: new FormControl(''),
    teacherName: new FormControl({value: '', disabled: true}, Validators.required),
    teacherID: new FormControl(''),
    lesson: new FormControl(''),
    category: new FormControl(''),
    batchYear: new FormControl(''),
    numberOfWeeks: new FormControl(''),
    classesPerWeek: new FormControl(''),
    mondayData: new FormControl('true'),
    tuesdayData: new FormControl(''),
    wednesdayData: new FormControl(''),
    thursdayData: new FormControl(''),
    fridayData: new FormControl(''),
    saturdayData: new FormControl(''),
    sundayData: new FormControl(''),
    mondayTime: new FormControl(''),
    tuesdayTime: new FormControl(''),
    wednesdayTime: new FormControl(''),
    thursdayTime: new FormControl(''),
    fridayTime: new FormControl(''),
    saturdayTime: new FormControl(''),
    sundayTime: new FormControl(''),
    linkData: new FormControl(''),
    otherDetails: new FormControl('')
  });
  

  constructor(public auth: AngularFireAuth, private afs: AngularFirestore, private accountService: AcconutService) {
    auth.authState.subscribe(user => {
      if (user) {
        const authUserData = firebase.auth().currentUser;
        this.checkCategory(authUserData);
        this.getValues(authUserData);
      }
    });
    
   }

   funct(){
    console.log(this.scheduleForm.get('mondayData').value)
   }

   async getValues(user){
    this.accountService.getUser(user).subscribe((user) => {
      this.userData = user
      this.scheduleForm.patchValue({
        teacherName: this.userData.displayName,
        teacherID: this.userData.uid
      });
    })
   }

   onScheduleSubmit(user){
    this.scheduleComplete = true;
      this.accountService.getUser(user).subscribe((user) => {
      const teacherName = user.displayName;
      const teacherID = user.uid;
      const scheduleValues = { ...this.scheduleForm.value, teacherName: teacherName, teacherID: teacherID };
      this.accountService.createClass(scheduleValues)
    })
    
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
