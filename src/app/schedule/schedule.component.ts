import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { from, Observable, Subscriber } from 'rxjs';
import { map, take, finalize } from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ConnectionService } from 'ng-connection-service'


import { User } from '../interfaces/user';
import { Slip } from '../interfaces/slip';
import { ClassInterface } from '../interfaces/class';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AcconutService } from '../services/acconut.service';
import {bookmark} from '../interfaces/bookmark'
import { ActivatedRoute } from '@angular/router';
import { message } from '../interfaces/message';
import { ProfileComponent } from './profile/profile.component';
import { SharedService } from '../services/shared.service';
import { joined } from '../interfaces/joined';
import { AngularFireStorage } from '@angular/fire/storage';

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
  showClasses = true;
  showSchedule = false;
  scheduleComplete = false;
  showSearch = false;
  showBookmarks = false;
  showBookmarkClass = false;
  showJoined = false;
  showJoinedClass = false;
  sideBar: string = '';
  chatBar:boolean;
  userData: User;
  userClasses: Observable<ClassInterface[]>;
  everyClasses: Observable<ClassInterface[]>;
  bookmarks: Observable<bookmark[]>;
  joinedClasses: Observable<joined[]>;
  // bookmarkedClass: Observable<ClassInterface>;
  // bookmarkClasses: Observable<ClassInterface[]>;
  moreInfoID: string = '';
  searchValue: string = "";
  searchValueTeacher: string = "";
  searchValueLesson: string = "";
  searchValueGrade: string = "";
  results: any;
  isConnected = true;
  paidOptions:boolean = false;
  noSlip: boolean = false;
  uploadPercent:  Observable<number>;
  openClass: boolean = false;
  downloadURL: Observable<string>;

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
  
  constructor(private storage: AngularFireStorage, private _snackBar: MatSnackBar, private route: ActivatedRoute, public auth: AngularFireAuth, 
    private afs: AngularFirestore, private accountService: AcconutService, private SharedService: SharedService,
    private ConnectionService: ConnectionService) {
      this.ConnectionService.monitor().subscribe(isC => {
        this.isConnected = isC;

      })
    auth.authState.subscribe(user => {
      if (user) {
        const authUserData = firebase.auth().currentUser;
        this.checkCategory(authUserData);
        this.getValues(authUserData);
        this.getUserClasses(authUserData);
        this.getBookmarkClasses(authUserData);
        this.getEveryClasses()
        this.getJoinedClasses(authUserData);
        
        this.SharedService.bookmarkVisibilityChange.subscribe((value) => {
          this.showBookmarkClass = value
        });
        this.SharedService.sideBarVisibilityChange.subscribe((value) => {
          this.chatBar = value
        });
        this.SharedService.pathIdChange.subscribe((value) => {
          this.pathId = value
        });
        this.SharedService.barChange.subscribe((value) => {
          this.sideBar = value
        });
        this.SharedService.openFromClasses.subscribe((value) => {
          if(value != ''){
            this.showBookmarks = false;
            this.showBookmarkClass = false;
            this.showJoined = false;
            this.showJoinedClass = false;
            this.showClasses = true;
            this.moreInfoID = value;
            value = ''
          }
        });
      }      
    });
   }

   selectedSlip: File;
   inputSlipFile(event){
    this.selectedSlip = event.target.files[0]
   }

   uploadSlip(user: User, cid, classData:ClassInterface){
    if(!this.selectedSlip){
      this.noSlip = true
    }else{
      const filePath = `slips/${cid}/users/${user.uid}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.selectedSlip);

      this.uploadPercent = task.percentageChanges(); 
      task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL()
          this.downloadURL.subscribe(dURL => {
           const slipData: Slip = {
            cid: cid,      
            className: classData.className,
            teacherName: classData.teacherName,
            teacherId: classData.teacherID,
            uid: user.uid,
            userName: user.displayName,
            slipLink: dURL,
            date: new Date()
          }
          this.accountService.saveSlip(classData.teacherID, cid, user.uid, slipData);
        })
        })
      )
      .subscribe()
      this.joinClass(cid, user.uid, classData.className, classData.teacherName, classData.teacherID, 0)
    }
   }

   openBookmarkedClass(id){
      this.SharedService.toggleSidebarVisibility(false, '', '');
      this.SharedService.toggleBookmarkVisibility();
   }

   getBookmarkClasses(user){
      this.bookmarks = this.accountService.getAllBookmarkedClasses(user.uid);
   }

   
   getJoinedClasses(user){
    this.joinedClasses = this.accountService.getAllJoinedClasses(user.uid);
  }

   showC(){
    if(!this.showClasses){
    this.showClasses = true;
    this.SharedService.toggleSidebarVisibility(false, '', '');    
    }else{
      this.showSearch = !this.showSearch; 
    }
    this.showBookmarks = false;
    this.showBookmarkClass = false;
    this.showJoined = false;
    this.showJoinedClass = false;
   }

   showBMF(){
    this.showClasses = false;
    this.showSearch = false;
    this.SharedService.toggleSidebarVisibility(false, '', '');
    
    this.showBookmarks = true;
    this.showBookmarkClass = false;

    this.showJoined = false;
    this.showJoinedClass = false;
   }

   showJ(){
    this.showClasses = false;
    this.showSearch = false;
    this.SharedService.toggleSidebarVisibility(false, '', '');    

    this.showBookmarks = false;
    this.showBookmarkClass = false;

    this.showJoined = true;
    this.showJoinedClass = false;

   }

   openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {
      duration: duration,
    });
  }

   searchClassF(field) {
     if(field == 'C'){
      //  console.log(field)
      this.everyClasses = this.accountService.searchClass(this.searchValue, 'className')
      this.searchValueTeacher = ''
      this.searchValueLesson = ''
      this.searchValueGrade = ''
     }else if(field == 'T'){
      this.everyClasses = this.accountService.searchClass(this.searchValueTeacher, 'teacherName')
      this.searchValue = ''
      this.searchValueLesson = ''
      this.searchValueGrade = ''
     }else if(field == 'L'){
      this.everyClasses = this.accountService.searchClass(this.searchValueLesson, 'lesson')
      this.searchValue = ''
      this.searchValueTeacher = ''
      this.searchValueGrade = ''
     }else if(field == 'Y'){
      this.everyClasses = this.accountService.searchClass(this.searchValueGrade, 'batchYear')
      this.searchValue = ''
      this.searchValueTeacher = ''
      this.searchValueLesson = ''
     }
    
  }

   profileBarEnable(id){
     if(id == this.pathId &&  this.sideBar == 'P'){
       this.SharedService.toggleSidebarVisibility(false, '', 'P');
      // this.pathId = '';
      // this.chatBar = false;
     }else{
      this.SharedService.toggleSidebarVisibility(true, id, 'P');
      //  this.pathId = id;   
      //   this.chatBar = true;
     }
    //  this.sideBar = 'P';
     this.moreInfoID = '';
   }

   QuestionBarEnable(id){     
    if(id == this.pathId &&  this.sideBar == 'Q'){
      this.SharedService.toggleSidebarVisibility(false, '', 'Q');
    //  this.pathId = '';
    //  this.chatBar = false;
    }else{
      this.SharedService.toggleSidebarVisibility(true, 'id', 'Q');
    //  this.pathId = id;
    //  this.chatBar = true;
    }
    // this.sideBar = 'Q';
    this.moreInfoID = '';
  }

  unhide(id){
    if(this.moreInfoID == id){
     this.moreInfoID = ''
    }else{
     this.moreInfoID = id;
    }
    this.SharedService.toggleSidebarVisibility(false, '', '');
    // this.chatBar = false;
    // this.pathId = '';
    // this.sideBar= '';
  }

   closeBPanel(){
    this.chatBar = false;
    this.pathId = '';
   }

   bookmarkClass(classID, userID, cName, tName, tid){
    // this.bookmarkBar = true;
    // this.chatBar = false;
    this.accountService.getBookmarkedClass(classID, userID).pipe(take(1), map((bookmark: bookmark) => {
      if(bookmark){
        if(bookmark.bookmark){
          this.openSnackBar('Class is been removed from the bookmarks.', 'OK', 5000);
          return ({bookmark: false});
        }else{
          this.openSnackBar('Class is been added to the bookmarks.', 'OK', 5000);
          return ({bookmark: true});
        }
      }else{
        this.openSnackBar('Class is been added to the bookmarks.', 'OK', 5000);
        return ({bookmark: true});
      }

    })).subscribe(({bookmark}) => {

      if(bookmark){
      const newBM: bookmark = {
        bookmark,
        uid: userID,
        classid: classID,
        className: cName,
        teacherName: tName,
        teacherID: tid,
      }

      this.accountService.bookmarkClass(classID, userID, newBM);
      }else{
        this.accountService.deleteBookmarkClass(classID, userID);
      }
     
    });
   }

   joinClass(classID, userID, cName, tName, tid, complete){
    // this.bookmarkBar = true;
    // this.chatBar = false;
      this.openSnackBar('You joined to this class!', 'OK', 5000);

      const newJ: joined = {
        joined: true,
        complete: complete,
        uid: userID,
        classid: classID,
        className: cName,
        teacherName: tName,
        teacherID: tid,
      }

      this.accountService.joinClass(classID, userID, newJ);
   }

   deleteBookmark(cid, uid){
    this.accountService.deleteBookmarkClass(cid, uid);
    this.openSnackBar('Bookmark has been deleted', 'OK', 5000);
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
