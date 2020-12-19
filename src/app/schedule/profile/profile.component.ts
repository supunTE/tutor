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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private route: ActivatedRoute, public auth: AngularFireAuth, private accountService: AcconutService, private afs: AngularFirestore) { 


  }

  ngOnInit(): void {
  }

}
