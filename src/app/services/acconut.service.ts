import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../interfaces/user';
import { Teacher } from '../interfaces/teacher';
import { ClassInterface } from '../interfaces/class';
import {bookmark} from '../interfaces/bookmark';
import {joined} from '../interfaces/joined';
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
    if(data.bookmark){
      this.afs.doc(`classes/${classID}/bookmarkedBy/${userID}`).set({bookmark:true});
    }else{
      this.afs.doc(`classes/${classID}/bookmarkedBy/${userID}`).set({bookmark:false});
    }
    return this.afs.doc<bookmark>(`bookmarks/${userID}/bookmarks/${classID}`).set(data);
  }

  deleteBookmarkClass(classID, userID){
    return this.afs.doc<bookmark>(`bookmarks/${userID}/bookmarks/${classID}`).delete();
  }

  getAllBookmarkedClasses(uid){
    return this.afs.collection<bookmark>(`bookmarks/${uid}/bookmarks`).valueChanges({idField: 'docId'});
  }

  getMessageClass(classID, userID){
    return this.afs.collection<message>(`messages/${classID}/messages/${userID}/message`, ref => 
    ref.orderBy('time')).valueChanges({idField: 'docId'});
  }

  messageClass(classID, userID, data){
    return this.afs.collection<message>(`messages/${classID}/messages/${userID}/message`).add(data);
  }

  deleteMessage(cid, uid, id){
    return this.afs.doc(`messages/${cid}/messages/${uid}/message/${id}`).update({delete: true});
  }

  getTeacher(id){
    return this.afs.doc<Teacher>(`users/${id}`).valueChanges();
  }

  joinClass(cid, uid, data){
    return this.afs.doc<bookmark>(`joined/${uid}/joined/${cid}`).set(data);
  }

  getAllJoinedClasses(uid){
    return this.afs.collection<joined>(`joined/${uid}/joined`).valueChanges({idField: 'docId'});
  }


}
