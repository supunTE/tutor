import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import firebase from 'firebase/app';
import { Observable, Subscriber, of, Timestamp } from 'rxjs';
import { AcconutService } from '../../services/acconut.service';
import { ClassInterface } from '../../interfaces/class';
import { AngularFirestore } from '@angular/fire/firestore';
import { SharedService } from '../../services/shared.service';


@Component({
  selector: 'app-joined-in-classes',
  templateUrl: './joined-in-classes.component.html',
  styleUrls: ['./joined-in-classes.component.scss']
})
export class JoinedInClassesComponent implements OnInit {
  private sub: any;
  idnum: any;
  selectedClass: ClassInterface;
  showBookmarkClass: boolean;

  constructor(private route: ActivatedRoute, public auth: AngularFireAuth, private accountService: AcconutService,
     private afs: AngularFirestore, private SharedService: SharedService) { 
    auth.authState.subscribe(user => {
      if (user) {
        const authUserData = firebase.auth().currentUser;
         this.sub = this.route.params.subscribe(async params => {
            this.idnum = params.id;
            this.getSelectedClass(await this.idnum);

            this.SharedService.bookmarkVisibilityChange.subscribe((value) => {
              this.showBookmarkClass = value
            });
            
    })
  }})
  }

  unhide(id){
    this.SharedService.toggleBookmarkVisibility();
 }

  getSelectedClass(id){
    this.accountService.getSelectedClass(id).subscribe(sClass => this.selectedClass = sClass)
  }

  profileBarEnable(id){
    this.SharedService.toggleSidebarVisibility(true, id, 'P');
    this.SharedService.toggleBookmarkVisibility()
  }

  QuestionBarEnable(id){
    this.SharedService.toggleSidebarVisibility(true, id, 'Q');
    this.SharedService.toggleBookmarkVisibility()
  }


  ngOnInit(): void {
  }

}
