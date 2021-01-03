import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { merge, Observable } from 'rxjs';
import { finalize, map, take } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { AcconutService } from '../services/acconut.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { LinebrPipe } from '../pipes/linebr.pipe';
import { NgxSpinnerService } from "ngx-spinner";
import { Subject } from 'rxjs';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})

export class AccountComponent implements OnInit, OnDestroy {
  users: Observable<User[]>;
  userData: User;
  userName: string = '';
  description = '';
  editData: boolean = false;
  onSafari: boolean = false;

  private ngUnsubscribe = new Subject();

  // descriptionDis = '';

  constructor(private spinner: NgxSpinnerService, public auth: AngularFireAuth, private afs: AngularFirestore, private accountService: AcconutService, private storage: AngularFireStorage) {
    // this.users = this.accountService.getAllUsers();
    auth.authState.subscribe(user => {
      if (user) {
        this.updateUser(firebase.auth().currentUser);
      }
    });
  }

  editDataFunction(){
    this.editData = !this.editData
  }

  updateUser(user){
  
    this.accountService.getUser(user).subscribe(user =>{
    this.userData = user
    
      this.spinner.hide("accountSpin");
  })
  }

  addUser(user){
    this.accountService.getUser(user).pipe(take(1), map((userDb: User) => {
      if(userDb){
        // console.log(true)
        const {joined, category, displayName, description, img} = userDb;
        return ({joined, category, displayName, description, img});
      }else{
        // console.log(false)
        return ({joined: new Date(), category: 'Student', displayName: user.displayName, description: '', img: user.photoURL});
      }
    })).subscribe(({joined, category, displayName, description, img}) => {
      const newUser: User = {
        displayName,
        description,
        uid: user.uid,
        joined,
        category,
        img
      }

      this.accountService.createUser(newUser);
    });
  }

  changeCategory(user, category){
    this.accountService.getUser(user).pipe(take(1), map((userDb: User) => {
        const {joined, displayName, uid, img, description} = userDb;
        return ({joined, displayName, uid, img, description});
    })).subscribe(({joined, displayName, uid, img, description}) => {
      const newUser: User = {
        displayName,
        description,
        uid,
        joined,
        category: category,
        img,
      }

      this.accountService.updateUser(newUser);
    });
  }

  changeName(user){
    this.accountService.getUser(user).pipe(take(1), map((userDb: User) => {
        const {joined, category, uid, img, description} = userDb;
        return ({joined, category, uid, img, description});
    })).subscribe(({joined, category, uid, img, description}) => {
      const newUser: User = {
        displayName: this.userName,
        description,
        uid,
        joined,
        category,
        img,
      }

      this.accountService.updateUser(newUser);
    this.userName = '';

    });

  }

  changeDescription(user){
    this.accountService.getUser(user).pipe(take(1), map((userDb: User) => {
        const {joined, category, uid, img, displayName} = userDb;
        return ({joined, category, uid, img, displayName});
    })).subscribe(({joined, category, uid, img, displayName}) => {
      const newUser: User = {
        displayName,
        description: this.description,
        uid,
        joined,
        category,
        img,
      }

      this.accountService.updateUser(newUser);
      this.description = '';
    });
    
  }

  uploadFile(event, user) {
    

    this.accountService.getUser(user).pipe(take(1), map((userDb: User) => {
      const {joined, category, uid, description, displayName} = userDb;
      return ({joined, category, uid, description, displayName});
        })).subscribe(({joined, category, uid, description, displayName}) => {

          const file = event.target.files[0];
          const filePath = `profiles/${user.uid}`;
          const fileRef = this.storage.ref(filePath);
          // const task = this.storage.upload(filePath, file);
          this.storage.upload(filePath, file).snapshotChanges().pipe(
            finalize(()=>{
              fileRef.getDownloadURL().subscribe((url)=>{
                const urlStorage = url;

                const newUser: User = {
                  displayName,
                  description,
                  uid,
                  joined,
                  category,
                  img:url,
                }
      
              this.accountService.updateUser(newUser);
              })
            })
          ).subscribe();     

  });
  }

  // addBr(){
  //   this.description = this.description + '\n'
  //   this.descriptionDis = this.description;
  // }

  async login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.auth.signInWithPopup(provider);
    return this.addUser(credential.user);
  }

  logout() {
    this.auth.signOut();
  }

  ngOnInit(): void {
     this.getBrowserName();

     this.spinner.show("accountSpin");
  }

  ngAfterViewInit(): void {
    this.spinner.show("accountSpin");

  setTimeout(() => {
    this.spinner.hide("accountSpin");
  }, 6000);

  }

  getBrowserName() {
   
    // if(navigator.userAgent.indexOf("MSIE")!=-1){
    //     name = "MSIE";
    // }
    // else if(navigator.userAgent.indexOf("Firefox")!=-1){
    //     name = "Firefox";
    // }
    // else if(navigator.userAgent.indexOf("Opera")!=-1){
    //     name = "Opera";
    // }
    // else if(navigator.userAgent.indexOf("Chrome") != -1){
    //     name = "Chrome";
    // }
    // else 
    if(navigator.userAgent.indexOf("Safari")!=-1){
      this.onSafari = true;
    }
}

ngOnDestroy() {
  this.ngUnsubscribe.next();
  this.ngUnsubscribe.complete();
}

}
