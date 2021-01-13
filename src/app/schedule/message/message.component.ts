import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import firebase from 'firebase/app';
import { Observable, Subscriber, of, Timestamp } from 'rxjs';
import { AcconutService } from '../../services/acconut.service';
import {message} from '../../interfaces/message'
import { ClassInterface } from '../../interfaces/class';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  private sub: any;
  idnum: any;
  selectedClass: ClassInterface;
  classMesssages: Observable<message[]>;
  chatInput: string = "";

  constructor(private route: ActivatedRoute, public auth: AngularFireAuth, private accountService: AcconutService, private afs: AngularFirestore) { 
    auth.authState.subscribe(user => {
      if (user) {
        const authUserData = firebase.auth().currentUser;
         this.sub = this.route.params.subscribe(async params => {
            this.idnum = params.id;
            this.getSelectedClass(await this.idnum, authUserData.uid);
    })
  }})
  }

  getSelectedClass(cid, uid){
    this.accountService.getSelectedClass(cid).subscribe(sClass => this.selectedClass = sClass)
    this.classMesssages = this.accountService.getMessageClass(cid, uid)

  }

  sendMessage(uid, cid){
    // console.log(cid)
    if(this.chatInput != ''){
    const todayTime = new Date()
    const newMessage: message = {
      uid: uid,
      classid: cid,
      message: this.chatInput,
      time: todayTime

    }
    this.accountService.messageClass(cid, uid, newMessage)
    this.chatInput = ""; 
    }
  }

  deleteMessage(uid, cid, id){
    this.accountService.deleteMessage(cid, uid, id)
  }

  ngOnInit(): void {
  }

}
