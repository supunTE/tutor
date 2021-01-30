import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { from, Observable, Subscriber } from 'rxjs';
import { map, take, finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConnectionService } from 'ng-connection-service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  group
} from '@angular/animations';

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
  styleUrls: ['./schedule.component.scss'],
  animations: [trigger('myInsertRemoveTrigger', [
    transition(':enter', [
      style({ opacity: 0, height:0 }),
      animate('300ms', style({ opacity: 1, height: 'calc(90vh - 5em)' })),
    ]),
    transition(':leave', [
      animate('300ms', style({ opacity: 0, height:0  })),
    ])
  ])
  ]
})
export class ScheduleComponent implements OnInit {
  formValues:any = '';
  stateStudent = false;
  stateTeacher = false;
  pathId:string = '';
  classData: ClassInterface;
  userState: string = '';
  showClasses = false;
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
  // weekRouteMethodEnable = false;

  todayDate; dtEndTxt; dtStartTxt; dtRangeTxt; minRangeDate; maxRangeDate; methodSelect:number = 1;

  scheduleForm = new FormGroup({
    className: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(40)]),
    subject: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]),
    teacherName: new FormControl({value: '', disabled: true}, Validators.required),
    lesson: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]),
    category: new FormControl('', [Validators.required]),
    batchYear: new FormControl('', [Validators.required]),
    durationStart: new FormControl('', Validators.required),
    durationEnd: new FormControl('', Validators.required),
    classesPerWeek: new FormControl(''),
    classMethod: new FormControl(''),
    weekData: new FormControl(''),
    classType: new FormControl(''),
    moneyAmount: new FormControl('0'),
    moneyUnit: new FormControl(''), 
    // mondayData: new FormControl('true'),
    // tuesdayData: new FormControl(''),
    // wednesdayData: new FormControl(''),
    // thursdayData: new FormControl(''),
    // fridayData: new FormControl(''),
    // saturdayData: new FormControl(''),
    // sundayData: new FormControl(''),
    mondayTime: new FormControl(''),
    tuesdayTime: new FormControl(''),
    wednesdayTime: new FormControl(''),
    thursdayTime: new FormControl(''),
    fridayTime: new FormControl(''),
    saturdayTime: new FormControl(''),
    sundayTime: new FormControl(''),
    otherDetails: new FormControl('')
  });

  weekDays = [
    {value:'monday', key:'mondayTime'},
    {value:'tuesday', key:'tuesdayTime'},
    {value:'wednesday', key:'wednesdayTime'},
    {value:'thursday', key:'thursdayTime'},
    {value:'friday', key:'fridayTime'},
    {value:'saturday', key:'saturdayTime'},
    {value:'sunday', key:'sundayTime'}
  ]
  
  constructor(private storage: AngularFireStorage, private _snackBar: MatSnackBar, private route: ActivatedRoute, public auth: AngularFireAuth, 
    private afs: AngularFirestore, private accountService: AcconutService, private SharedService: SharedService,
    private ConnectionService: ConnectionService) {

      this.ConnectionService.monitor().subscribe(isC => {
        this.isConnected = isC;
      })

      this.scheduleForm.get('classType').valueChanges
      .subscribe(value => this.classTypeChange(value));

      this.scheduleForm.get('classMethod').valueChanges
      .subscribe(value => this.classMethodChange(value));

      this.scheduleForm.get('weekData').valueChanges
      .subscribe(value => this.weekDataChange(value));

      this.scheduleForm.get('moneyUnit').valueChanges
      .subscribe(value => this.moneyAmountChange(value));

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
            className: classData.main.className,
            teacherName: classData.main.teacherName,
            teacherId: classData.main.teacherID,
            uid: user.uid,
            userName: user.displayName,
            slipLink: dURL,
            date: new Date()
          }
          this.accountService.saveSlip(classData.main.teacherID, cid, user.uid, slipData);
        })
        })
      )
      .subscribe()
      this.joinClass(cid, user.uid, classData.main.className, classData.main.teacherName, classData.main.teacherID, 0)
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

   showS(){
    this.showSchedule = !this.showSchedule;
    this.showClasses = true;
    this.showSearch = false;
    this.SharedService.toggleSidebarVisibility(false, '', '');    

    this.showBookmarks = false;
    this.showBookmarkClass = false;

    this.showJoined = false;
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
    //  console.log(this.userClasses)
   }

   async getValues(user){
    this.accountService.getUser(user).subscribe((user) => {
      this.userData = user
      this.scheduleForm.patchValue({
        teacherName: this.userData.displayName,
        moneyAmount: 0
      });
    })
   }

   onScheduleSubmit(user){
    this.scheduleComplete = true;
      this.accountService.getUser(user).subscribe((user) => {
      const teacherName = user.displayName;
      const teacherID = user.uid;
      this.formValues = this.scheduleForm.value;
      // console.log(this.formValues.classType)
      if(this.formValues.classType == 'false'){
        this.formValues.moneyAmount = 0;
        this.formValues.moneyUnit = '';
      }
      console.log(this.formValues.moneyAmount)
      if(this.formValues.classMethod==2){
        this.formValues.classesPerWeek = ''
        this.formValues.weekData = ''
        this.formValues.mondayTime = ''
        this.formValues.tuesdayTime = ''
        this.formValues.wednesdayTime = ''
        this.formValues.thursdayTime = ''
        this.formValues.fridayTime = ''
        this.formValues.saturdayTime = ''
        this.formValues.sundayTime = ''
      }
        if(!this.formValues.weekData.includes('monday')){
         this.formValues.mondayTime = ''
        }
        if(!this.formValues.weekData.includes('tuesday')){
          this.formValues.tuesdayTime = ''
         }
         if(!this.formValues.weekData.includes('wednesday')){
          this.formValues.wednesdayTime = ''
         }
         if(!this.formValues.weekData.includes('thursday')){
          this.formValues.thursdayTime = ''
         }
         if(!this.formValues.weekData.includes('friday')){
          this.formValues.fridayTime = ''
         }
         if(!this.formValues.weekData.includes('saturday')){
          this.formValues.saturdayTime = ''
         }
         if(!this.formValues.weekData.includes('sunday')){
          this.formValues.sundayTime = ''
         }
         
      // if(this.formValues.weekData.includes())

      // <mat-option value="1">Weekday Routine Method</mat-option>
      // <mat-option value="2">Event Schedule Method</mat-option>
      const dataClass: ClassInterface = {
        main:{
          className: this.formValues.className,
          teacherName: teacherName,
          teacherID: teacherID,
          subject: this.formValues.subject,        
          fee: this.formValues.classType,
          lesson: this.formValues.lesson,
          category: this.formValues.category,
          batchYear: this.formValues.batchYear,
          classMethod: this.formValues.classMethod,
          otherDetails: this.formValues.otherDetails
        },    
        amount:{
          feeAmount: this.formValues.moneyAmount,
          moneyunit: this.formValues.moneyUnit,
        },
        duration:{
          duration: this.dtRangeTxt,
          durationStart: this.formValues.durationStart,
          durationEnd: this.formValues.durationEnd,
          classesPerWeek: this.formValues.classesPerWeek,
        },
        week:{
          weekData: this.formValues.weekData,
          mondayTime: this.formValues.mondayTime,
          tuesdayTime: this.formValues.tuesdayTime,
          wednesdayTime: this.formValues.wednesdayTime,
          thursdayTime: this.formValues.thursdayTime,
          fridayTime: this.formValues.fridayTime,
          saturdayTime: this.formValues.saturdayTime,
          sundayTime: this.formValues.sundayTime,
        }
    }
      this.accountService.createClass(dataClass)
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

  // classMethodChange(){
  //   const classMethodNum = this.scheduleForm.value.classMethod;
  //   if(classMethodNum == 1){
  //     this.weekRouteMethodEnable = true;
  //   }else{
  //     this.weekRouteMethodEnable = false;
  //   }
  //   console.log(this.weekRouteMethodEnable)

  // }

  classDaysSelectionChanged(){
    const weekDataControl = this.scheduleForm.get('weekData');
    const weekDataLen = this.scheduleForm.get('weekData').value?.length;
    const weekData = this.scheduleForm.get('weekData');    
    const classesPerWeekValue = this.scheduleForm.value.classesPerWeek;

    weekDataControl.setValidators([Validators.required, Validators.minLength(classesPerWeekValue)]);
    weekDataControl.updateValueAndValidity();
    
    if( classesPerWeekValue < weekDataLen){
      weekData.setValue(weekData.value.slice(0,classesPerWeekValue))
    } 
  }

  changeStartDate(event: MatDatepickerInputEvent<Date>){
      this.dtStartTxt = event.value;
      this.getDifferences();
  }

  changeEndDate(event: MatDatepickerInputEvent<Date>){    
    this.dtEndTxt = event.value;
    this.getDifferences();
  }

  getDifferences(){
    if(this.dtStartTxt && this.dtEndTxt){
      const diffTime = Math.abs(this.dtEndTxt - this.dtStartTxt);
      const diffDays = (Math.ceil(diffTime / (1000 * 60 * 60 * 24)))+1
      if(diffDays<100){
        this.dtRangeTxt = diffDays  + " Days";
      }else{
        this.dtRangeTxt =   " ?? Days";
      }
    }else{
      this.dtRangeTxt = '';
    }
  }

  pickMonthAfter(){
    this.todayDate = new Date();  
    this.todayDate.setMonth(this.todayDate.getMonth() + 1)
    return this.todayDate;
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

  classTypeChange(value){
    const moneyUnitControl = this.scheduleForm.get('moneyUnit');
    const moneyAmountControl = this.scheduleForm.get('moneyAmount');
    // const moneyUnitValue = this.scheduleForm.value.moneyUnit;

    if(value == 'true'){
      moneyUnitControl.setValidators([Validators.required]);
      moneyAmountControl.setValidators([Validators.required]);
      // if(moneyUnitValue == "lkr"){
      //   moneyAmountControl.setValidators([Validators.required, Validators.min(100), Validators.max(10000)]);
      //   moneyAmountControl.updateValueAndValidity();      
      // }else if(moneyUnitValue == "usd"){
      //   moneyAmountControl.setValidators([Validators.required, Validators.min(1), Validators.max(50)]);
      //   moneyAmountControl.updateValueAndValidity();
      // }else{

      // }
    }else{
      moneyUnitControl.clearValidators();
      moneyAmountControl.clearValidators();
    }

    moneyUnitControl.updateValueAndValidity();
    moneyAmountControl.updateValueAndValidity();
  }

  moneyAmountChange(value){
    
    const classTypeValue = this.scheduleForm.value.classType;    
    const moneyAmountControl = this.scheduleForm.get('moneyAmount');
    // const moneyUnitValue = this.scheduleForm.value.moneyUnit;

    if(classTypeValue == "true"){
    if(value == "lkr"){     
      moneyAmountControl.enable();
      moneyAmountControl.setValidators([Validators.required, Validators.min(100), Validators.max(10000)]);
      moneyAmountControl.updateValueAndValidity();      
    }else if(value == "usd"){
      moneyAmountControl.enable();
      moneyAmountControl.setValidators([Validators.required, Validators.min(1), Validators.max(50)]);
      moneyAmountControl.updateValueAndValidity();
    }else{
      moneyAmountControl.clearValidators();
      moneyAmountControl.updateValueAndValidity();
      moneyAmountControl.disable();
    }
    }else{
      this.scheduleForm.value.classType = 0;
      moneyAmountControl.clearValidators();
      moneyAmountControl.updateValueAndValidity();
      moneyAmountControl.disable();
    }

  }

  classMethodChange(value){
    const classesPerWeekValue = this.scheduleForm.value.classesPerWeek;
    const classesPerWeekControl = this.scheduleForm.get('classesPerWeek');
    const weekDataControl = this.scheduleForm.get('weekData');

    if(value == '1'){
      classesPerWeekControl.setValidators([Validators.required]);
      weekDataControl.setValidators([Validators.required, Validators.minLength(classesPerWeekValue)]);
    }else{
      classesPerWeekControl.clearValidators();
      if(weekDataControl){
        weekDataControl.clearValidators();
      }
    }

    classesPerWeekControl.updateValueAndValidity();
    weekDataControl.updateValueAndValidity();

  }

  weekDataChange(value){
    if(value){
    for(var i =0; i<7; i++){
    if(value?.includes(this.weekDays[i].value)){
      this.scheduleForm.get((this[this.weekDays[i].key])).setValidators([Validators.required]);
    }else{
      this.scheduleForm.get((this[this.weekDays[i].key])).clearValidators();
    }
    this.scheduleForm.get((this[this.weekDays[i].key])).updateValueAndValidity();
    }
  }
  }


  ngOnInit(): void {
    this.dtStartTxt = new Date();  
    this.scheduleForm.get('durationStart').setValue(this.dtStartTxt);

    this.dtEndTxt = this.pickMonthAfter()
    this.scheduleForm.get('durationEnd').setValue(this.dtEndTxt);

    this.minRangeDate = this.pickStartDate();
    this.maxRangeDate = this.pickEndDate();

    this.getDifferences();
    
    this.showClasses = true;

    this.route.params.subscribe(async params => {
      if(params.id){
        this.chatBar = true;
      }
    })

   }

}
