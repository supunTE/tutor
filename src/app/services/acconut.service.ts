import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../interfaces/user';
import { ClassInterface } from '../interfaces/class';

@Injectable({
  providedIn: 'root'
})
export class AcconutService {

  constructor(private afs: AngularFirestore) { }
  
  getUser (user: User){
    return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
  }

  createUser (user: User){
    return this.afs.doc<User>(`users/${user.uid}`).set(user);
  }

  updateUser (user: User){
    return this.afs.doc<User>(`users/${user.uid}`).update(user);
  }

  getAllUsers(){
    return this.afs.collection<User>('users').valueChanges()
  }

  createClass(classData: ClassInterface){
    return this.afs.collection<ClassInterface>(`classes`).add(classData);
  }

}
