import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { merge, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { AcconutService } from '../services/acconut.service';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})

export class AccountComponent implements OnInit {
  users: Observable<User[]>;
  userData: User;
  userName: string = '';

  constructor(public auth: AngularFireAuth, private afs: AngularFirestore, private accountService: AcconutService) {
    // this.users = this.accountService.getAllUsers();
    auth.authState.subscribe(user => {
      if (user) {
        this.updateUser(firebase.auth().currentUser);
      }
    });
  }

  updateUser(user){
    this.accountService.getUser(user).subscribe(user => this.userData = user)
  }

  addUser(user){
    this.accountService.getUser(user).pipe(take(1), map((userDb: User) => {
      if(userDb){
        console.log(true)
        const {joined, category, displayName} = userDb;
        return ({joined, category, displayName});
      }else{
        console.log(false)
        return ({joined: new Date(), category: 'student', displayName: user.displayName});
      }
    })).subscribe(({joined, category, displayName}) => {
      const newUser: User = {
        displayName,
        uid: user.uid,
        joined,
        category,
        img: user.photoURL
      }

      this.accountService.createUser(newUser);
    });
  }

  changeCategory(user, category){
    this.accountService.getUser(user).pipe(take(1), map((userDb: User) => {
        const {joined, displayName, uid, img} = userDb;
        return ({joined, displayName, uid, img});
    })).subscribe(({joined, displayName, uid, img}) => {
      const newUser: User = {
        displayName,
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
        const {joined, category, uid, img} = userDb;
        return ({joined, category, uid, img});
    })).subscribe(({joined, category, uid, img}) => {
      const newUser: User = {
        displayName: this.userName,
        uid,
        joined,
        category,
        img,
      }

      this.accountService.updateUser(newUser);
    });
  }

  async login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.auth.signInWithPopup(provider);
    return this.addUser(credential.user);
  }

  logout() {
    this.auth.signOut();
  }

  ngOnInit(): void {
  }

}
