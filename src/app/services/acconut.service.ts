import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../interfaces/user';
import { Teacher } from '../interfaces/teacher';
import { ClassInterface, ClassLinksInterface, ClassDocsInterface } from '../interfaces/class';
import { bookmark } from '../interfaces/bookmark';
import { joined } from '../interfaces/joined';
import { message } from '../interfaces/message'
import { rateTeacher } from '../interfaces/rate';
import { Slip } from '../interfaces/slip';


@Injectable({
  providedIn: 'root'
})
export class AcconutService {

  constructor(private afs: AngularFirestore) { }
  
  getUser (user: User){
    return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
  }

  getUserWithId(uid){
    return this.afs.doc<User>(`users/${uid}`).valueChanges();
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
    return this.afs.collection<ClassInterface>(`classes`, ref => ref.where('main.teacherID', '==', user.uid)).valueChanges({idField: 'docId'});
  }

  getEveryClass(){
    return this.afs.collection<ClassInterface>(`classes`).valueChanges({idField: 'docId'});
  }

  getClass(bookmark: bookmark){
    return this.afs.doc<ClassInterface>(`classes/${bookmark.classid}`).valueChanges();
  }

  searchClass(searchValue, field){
    console.log(field)

    // return this.afs.collection<ClassInterface>(`classes`).valueChanges({idField: 'docId'});
    return this.afs.collection<ClassInterface>(`classes`, ref => ref
      .orderBy(field)
      .startAt(searchValue.toLowerCase())
      .endAt(searchValue.toLowerCase()+"\uf8ff")
      .limit(10))
      .valueChanges();
  }

  searchClassTeacherF(searchValue, field){
    // return this.afs.collection<ClassInterface>(`classes`).valueChanges({idField: 'docId'});
    return this.afs.collection<ClassInterface>(`classes`, ref => ref
      .orderBy(field)
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

  getSelectedJoinedClass(uid, cid){
    return this.afs.doc<joined>(`joined/${uid}/joined/${cid}`).valueChanges();
  }

  getLinksInJoinedClass(cid){
    return this.afs.collection<ClassLinksInterface>(`classes/${cid}/links`).valueChanges();
  }

  getDocsInJoinedClass(cid){
    return this.afs.collection<ClassDocsInterface>(`classes/${cid}/documents`).valueChanges();
  }

  rateSelectedTeacher(uid, tid, data){
    return this.afs.doc<rateTeacher>(`rates/teachers/rates/${tid}/rate/${uid}`).set(data)
  }

  getRateSelectedTeacher(uid, tid){
    return this.afs.doc<rateTeacher>(`rates/teachers/rates/${tid}/rate/${uid}`).valueChanges()
  }

  updateTotalRateSelectedTeacher(tid, count, raters){
    return this.afs.doc(`users/${tid}`).set({rateTotal: count, ratersTotal: raters}, {merge:true});
  }

  getTeachersRate(tid){
    return this.afs.collection<rateTeacher>(`rates/teachers/rates/${tid}/rate`, ref => ref
      .orderBy('time', 'desc')
      .limit(10))
      .valueChanges({idField: 'docId'});
  }

  saveSlip(tid, cid, uid, data){
    return this.afs.doc<Slip>(`slips/classes/slips/${tid}/class/${cid}/user/${uid}`).set(data)
  }


}
