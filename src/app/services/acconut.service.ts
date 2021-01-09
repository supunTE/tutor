import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../interfaces/user';
import { Teacher } from '../interfaces/teacher';
import { ClassInterface } from '../interfaces/class';
import {bookmark} from '../interfaces/bookmark';
import {message} from '../interfaces/message'


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
    return this.afs.collection<ClassInterface>('classes').add(classData);
  }

  getUserClass(user: User){
    return this.afs.collection<ClassInterface>(`classes`, ref => ref.where('teacherID', '==', user.uid)).valueChanges({idField: 'docId'});
  }

  getEveryClass(){
    return this.afs.collection<ClassInterface>(`classes`).valueChanges({idField: 'docId'});
  }

  getClass(bookmark: bookmark){
    return this.afs.doc<ClassInterface>(`classes/${bookmark.classid}`).valueChanges();
  }

  searchClass(searchValue){
    // return this.afs.collection<ClassInterface>(`classes`).valueChanges({idField: 'docId'});
    return this.afs.collection<ClassInterface>(`classes`, ref => ref
      .orderBy("className")
      .startAt(searchValue.toLowerCase())
      .endAt(searchValue.toLowerCase()+"\uf8ff")
      .limit(10))
      .valueChanges();
  }

  deleteSelectedClass(id){
    return this.afs.doc<ClassInterface>(`classes/${id}`).delete();
  }

  getSelectedClass(id){
    return this.afs.doc<ClassInterface>(`classes/${id}`).valueChanges({idField: 'docId'});
  }

  getBookmarkedClass(classID, userID){
    return this.afs.doc<bookmark>(`bookmarks/${userID}/bookmarks/${classID}`).valueChanges({idField: 'docId'});
  }

  bookmarkClass(classID, userID, data){
    return this.afs.doc<bookmark>(`bookmarks/${userID}/bookmarks/${classID}`).set(data);
  }

  deleteBookmarkClass(classID, userID){
    return this.afs.doc<bookmark>(`bookmarks/${userID}/bookmarks/${classID}`).delete();
  }

  getAllBookmarkedClasses(uid){
    // bookmarks/${user.uid}/
    // return this.afs.collection<ClassInterface>(`classes`, ref => ref.where('teacherID', '==', user.uid)).valueChanges({idField: 'docId'});

    // return this.afs.collection<ClassInterface>(`classes`, ref => 
    //   ref.where(`bookmark`, '==', 'true')).valueChanges({idField: 'docId'});
    return this.afs.collection<bookmark>(`bookmarks/${uid}/bookmarks`).valueChanges();
  }

  getMessageClass(classID, userID){
    return this.afs.collection<message>(`messages/${classID}/messages/${userID}/message`, ref => 
    ref.orderBy('time')).valueChanges({idField: 'docId'});
  }

  messageClass(classID, userID, data){
    return this.afs.collection<message>(`messages/${classID}/messages/${userID}/message`).add(data);
  }

  getTeacher(id){
    return this.afs.doc<Teacher>(`users/${id}`).valueChanges();
  }


}
