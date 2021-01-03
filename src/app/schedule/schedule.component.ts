import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { from, Observable, Subscriber } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { User } from '../interfaces/user';
import { ClassInterface } from '../interfaces/class';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AcconutService } from '../services/acconut.service';
import {bookmark} from '../interfaces/bookmark'
import { ActivatedRoute } from '@angular/router';
import { message } from '../interfaces/message';
import { ProfileComponent } from './profile/profile.component'

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  stateStudent = false;
  stateTeacher = false;
  pathId:string = '';
  classData: ClassInterface;
  userState: string = '';
  showSchedule = false;
  scheduleComplete = false;
  showSearch = false;
  bookmarkBar:boolean;
  chatBar:boolean;
  userData: User;
  userClasses: Observable<ClassInterface[]>;
  everyClasses: Observable<ClassInterface[]>;
  moreInfoID;
  searchValue: string = "";
  results: any;

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
  

  constructor(private route: ActivatedRoute, public auth: AngularFireAuth, private afs: AngularFirestore, private accountService: AcconutService) {
    auth.authState.subscribe(user => {
      if (user) {
        const authUserData = firebase.auth().currentUser;
        this.checkCategory(authUserData);
        this.getValues(authUserData);
        this.getUserClasses(authUserData)
        this.getEveryClasses()

      }
    });
    
   }

   searchClassF() {
    this.everyClasses = this.accountService.searchClass(this.searchValue)
  }

   chatBarEnable(id){
     if(id == this.pathId){
      this.pathId = '';
      this.bookmarkBar = false;
      this.chatBar = false;
     }else{
      this.pathId = id;
      this.bookmarkBar = false;
      this.chatBar = true;
     }
    
   }

   closeBPanel(){
    this.chatBar = false;
   }

   bookmarkClass(classID, userID){
    this.bookmarkBar = true;
    this.chatBar = false;
    this.accountService.getBookmarkedClass(classID, userID).pipe(take(1), map((bookmark: bookmark) => {
      if(bookmark){
        if(bookmark.bookmark){
          return ({bookmark: false, uid: userID, classid: classID});
        }else{
          return ({bookmark: true, uid: userID, classid: classID});
        }
      }else{
        return ({bookmark: true, uid: userID, classid: classID});
      }

    })).subscribe(({bookmark, uid, classid}) => {
      const newBM: bookmark = {
        bookmark,
        uid,
        classid 
      }

      this.accountService.bookmarkClass(classID, userID, newBM);
    });
   }

   unhide(id){
     if(this.moreInfoID == id){
      this.moreInfoID = ''
     }else{
      this.moreInfoID = id;
     }
   }

   deleteClass(id){
     this.accountService.deleteSelectedClass(id);
   }

   getEveryClasses(){
    this.everyClasses = this.accountService.getEveryClass();
  }

   getUserClasses(user){
     this.userClasses = this.accountService.getUserClass(user);
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
    if(state === 'Student'){
      this.stateStudent = true;
      this.stateTeacher = false;
    }

    if(state === 'Teacher'){
      this.stateTeacher = true;
      this.stateStudent = false;
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe(async params => {
      if(params.id){
        this.chatBar = true;
      }
  })
   }

}
